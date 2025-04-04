/**
 * MIT License
 * 
 * Copyright (c) 2025 Masato Nakatsuji
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as fs from "fs";
import * as path from "path";
import { IncomingHttpHeaders } from "http";
import { ThreadServerResponse } from "savatora-core/bin/ThreadServerResponse";
import { StatusCodeOption } from "savatora-plugin-statuscode/bin/StatusCodeOption";
import { ErrorCode } from "savatora-plugin-statuscode/bin/ErrorCode";

export class StatusCode {

    private defaultHTML : string;

    private buffers = {};

    public option : StatusCodeOption;

    public rootDir : string;

    public setBuffer() {
        this.defaultHTML = fs.readFileSync(__dirname + "/default.html").toString();
        if (!fs.existsSync(this.rootDir + "/" + this.option.dir)) return;
        const list = fs.readdirSync(this.rootDir + "/" + this.option.dir);
        for(let n = 0 ; n < list.length ; n++) {
            const filePath = this.rootDir + "/" + this.option.dir + "/" + list[n];
            const basename = path.basename(filePath);
            if (!fs.statSync(filePath).isFile()) continue;
            const content = fs.readFileSync(filePath).toString();
            this.buffers[basename] = content;
        }
    }

    public onListen(res: ThreadServerResponse) {
        const targetHTMLName = res.statusCode + ".html";
        let content : string;
        if (this.buffers[targetHTMLName]) {
            content = this.buffers[targetHTMLName];
        }
        else {
            content = this.defaultHTML;
            content = content.split("{{code}}").join(res.statusCode.toString());
            let description : string = "";
            if (ErrorCode[res.statusCode]) description = ErrorCode[res.statusCode];
            content = content.split("{{descrption}}").join(description);
        }
        this.setHeader(res, this.option.headers);
        res.write(content);
        res.end();
    }

    private setHeader(res: ThreadServerResponse, headers: IncomingHttpHeaders) {
        const c = Object.keys(headers);
        for (let n = 0 ; n < c.length ; n++) {
            const name = c[n];
            let value = headers[name];
            if (typeof value == "object") value = value.join(",");
            res.setHeader(name, value);
        }
    }
}