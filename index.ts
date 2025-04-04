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

import { ServerPluginBase } from "savatora-core/bin/ServerPluginBase";
import { ThreadServerRequest } from "savatora-core/bin/ThreadServerRequest";
import { ThreadServerResponse } from "savatora-core/bin/ThreadServerResponse";
import { StatusCode } from "./bin/StatusCode";
import { ServerSectorStatusCode } from "./bin/ServerSectorStatusCode";

export class ServerPlugin extends ServerPluginBase {

    private statusCodes : Array<StatusCode> = [];

    public async onBegin(sector: ServerSectorStatusCode) {
        if (!sector.statusCodes) sector.statusCodes = {};
        if (!sector.statusCodes.dir) sector.statusCodes.dir = "statusCodes";
        if (!sector.statusCodes.headers) sector.statusCodes.headers = {};
        const sc_ = new StatusCode();
        sc_.option = sector.statusCodes;
        sc_.rootDir = sector.rootDir;
        sc_.setBuffer();
        this.statusCodes.push(sc_);
    }

    public async onListen(req: ThreadServerRequest, res: ThreadServerResponse) {
        if (!res.statusCode) res.statusCode = 404;
        for(let n = 0 ; n < this.statusCodes.length ; n++) {
            const sc_ = this.statusCodes[n];
            if (res.statusCode < 400) continue;
            sc_.onListen(res);
        }
    }
}