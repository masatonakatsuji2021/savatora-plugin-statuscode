"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerPlugin = void 0;
const ServerPluginBase_1 = require("savatora-core/bin/ServerPluginBase");
const StatusCode_1 = require("./bin/StatusCode");
class ServerPlugin extends ServerPluginBase_1.ServerPluginBase {
    constructor() {
        super(...arguments);
        this.statusCodes = [];
    }
    onBegin(sector) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!sector.statusCodes)
                sector.statusCodes = {};
            if (!sector.statusCodes.dir)
                sector.statusCodes.dir = "statusCodes";
            if (!sector.statusCodes.headers)
                sector.statusCodes.headers = {};
            const sc_ = new StatusCode_1.StatusCode();
            sc_.option = sector.statusCodes;
            sc_.rootDir = sector.rootDir;
            sc_.setBuffer();
            this.statusCodes.push(sc_);
        });
    }
    onListen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!res.statusCode)
                res.statusCode = 404;
            for (let n = 0; n < this.statusCodes.length; n++) {
                const sc_ = this.statusCodes[n];
                if (res.statusCode < 400)
                    continue;
                sc_.onListen(res);
            }
        });
    }
}
exports.ServerPlugin = ServerPlugin;
