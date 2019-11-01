import Logger from "../../Utils/Logger";
import StringUtil from "../../Utils/StringUtil";

/**
 * 服务器信息
 */

export default class ServerInfo {

    name: string;       // 名称
    domain: string;     // 域名
    port: number;       // 端口号
    yxdTag: string;     // 游戏盾标识
    yxdIp: string;     // 游戏盾ip
    yxdPort: number;       // 游戏盾端口
    yxdUsed: boolean = false;   // 游戏盾是否启用

    constructor(name: string, domain: string, port: number = undefined, yxdTag: string = "") {
        this.name = name;
        this.domain = domain;
        this.port = port;
        this.yxdTag = yxdTag;
    }

    getRealIp() {
        if (this.yxdUsed) {
            return this.yxdIp;
        } else {
            return this.domain;
        }
    }

    getRealPort() {
        if (this.yxdUsed) {
            return this.yxdPort;
        } else {
            return this.port;
        }
    }

    /**
     * 通过url地址解析domain和port
        this.parseUrl("www.1.com:3333")
        this.parseUrl("http://www.1.com:3333")
        this.parseUrl("ws://www.1.com:3333")
        this.parseUrl("ws:/www.1.com:3333")
     */
    parseUrl(url: string) {
        let reg: RegExp = new RegExp(/:[0-9]{1,5}/);
        // 是否包含端口号
        let matchArray: RegExpMatchArray = url.match(reg);
        if (matchArray != null) {
            this.port = parseInt(matchArray[0].slice(1));
            let index = url.lastIndexOf(matchArray[0]);
            url = url.slice(0, index);
        }
        // 去除协议头
        reg = new RegExp(/.*:\/\//);
        matchArray = url.match(reg);
        if (matchArray != null) {
            let index = url.indexOf(matchArray[0]);
            url = url.slice(index + matchArray[0].length + 1);
            this.domain = url;
        } else {
            reg = new RegExp(/.*:\//);
            matchArray = url.match(reg);
            if (matchArray != null) {
                let index = url.indexOf(matchArray[0]);
                url = url.slice(index + matchArray[0].length + 1);
                this.domain = url;
            } else {
                this.domain = url;
            }
        }
    }

    /**
     * 获取域名 url
     */
    getUrl(): string {
        let domain, port;
        if (this.yxdUsed) {
            domain = this.yxdIp;
            port = this.yxdPort;
        } else {
            domain = this.domain;
            port = this.port;
        }
        if (this.port) {
            return `${this.domain}:${this.port}`;
        }
        return `${this.domain}`;
    }

    /**
     * 获取websocket url
     */
    getWebSocketUrl(): string {
        let url: string = this.getUrl();
        if (url.indexOf("ws://") != 0 && url.indexOf("wss://") != 0) {
            url = `ws://${url}`;
        }
        return url;
    }

    /**
     * 获取http url
     */
    getHttpUrl(): string {
        let url: string = this.getUrl();
        if (url.indexOf("http://") != 0 && url.indexOf("https://") != 0) {
            url = `http://${url}`;
        }
        return url;
    }

}


/**
 * 服务器文件信息
 */

export class ServerFilesInfo {

    name: string;     // 服务器名称
    serverInfo: ServerInfo; // 服务器信息
    private fileMap: Object;           // 文件路径映射表

    constructor(name: string) {
        this.name = name;
        this.fileMap = {};
    }

    addFile(name: string, fileInfo: Object) {
        if (this.fileMap.hasOwnProperty(name)) {
            Logger.warn(`Server file duplicated! ${name}`);
            return;
        }
        this.fileMap[name] = fileInfo;
    }

    getFile(name: string): string {
        if (this.fileMap.hasOwnProperty(name)) {
            return this.fileMap[name]['filePath'];
        }
        return "";
    }

    hasServer() {
        return this.serverInfo != undefined;
    }

    setServer(serverInfo: ServerInfo) {
        this.serverInfo = serverInfo;
    }

    getFileUrl(name: string): string {
        let filePath: string = "";
        if (this.fileMap.hasOwnProperty(name)) {
            filePath = this.fileMap[name]["filePath"];
        }
        let serverUrl: string = this.serverInfo.getUrl();
        return `${serverUrl}/${filePath}`;
    }

    getFileHttpUrl(name: string): string {
        let filePath: string = "";
        if (this.fileMap.hasOwnProperty(name)) {
            filePath = this.fileMap[name]["filePath"];
        }
        let serverUrl: string = this.serverInfo.getHttpUrl();
        return `${serverUrl}/${filePath}`;
    }

    getFileHttpUrlWithParams(name: string, ...params): string {
        let filePath: string = "";
        let formatStr: string = "";
        if (this.fileMap.hasOwnProperty(name)) {
            let fileInfo = this.fileMap[name];
            filePath = fileInfo["filePath"];
            formatStr = fileInfo["paramFormat"];
        }

        let serverUrl: string = this.serverInfo.getHttpUrl();
        if (formatStr.length) {
            let params_string = StringUtil.format(formatStr, ...params);
            return `${serverUrl}/${filePath}?$${params_string}`;
        } else {
            return `${serverUrl}/${filePath}`;
        }
    }

    getFileHttpUrlWithParamsMD5(name: string, ...params): string {
        let fileInfo = undefined
        if (this.fileMap.hasOwnProperty(name)) {
            fileInfo = this.fileMap[name];
        }
        let url = this.serverInfo.getHttpUrl() + fileInfo.filePath;
        let urlNormal = StringUtil.format(fileInfo.paramFormat, ...params);
        let urlKey = `${urlNormal}&key=${fileInfo.md5Key}`;
        let paramStr = `${urlNormal}&sign=${md5(urlKey)}`;
        url += `?${paramStr}`;
        return url;
    }
}

/**
 * 服务器轮询
 */
export class ServerRollPolling {
    serverList: ServerInfo[];       // 服务器列表
    currentIndex: number = 0;      // 当前索引

    constructor(serverList: ServerInfo[]) {
        if (serverList.length == 0) {
            Logger.error("server length == 0");
        }
        this.serverList = serverList;
    }

    updateServerList(serverList: ServerInfo[]) {
        this.serverList = serverList;
        this.currentIndex = 0;
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.serverList.length;
    }

    getServer(): ServerInfo {
        return this.serverList[this.currentIndex];
    }
}

