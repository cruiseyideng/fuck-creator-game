import ServerInfo, { ServerFilesInfo, ServerRollPolling } from "../DataStruct/ServerInfo";
import Logger from "../../Utils/Logger";
import Global from "../Global";

/**
 * 服务器配置
 */

export default class ServerConfig {
    hotUpdateServer: ServerInfo;                    // 热更服务
    webServer: ServerInfo;                          // web服务器
    hotUpdateServerFiles: ServerFilesInfo;          // file server files

    init() {
        let configPath: string = Global.pathConfig.serverConfigPath;
        let jsonFileObj: Object = Global.loaderMgr.getCacheObject(configPath);
        if (!jsonFileObj) {
            Logger.error("json obj is not inited!");
            return;
        }
        this.parseJsonObject(jsonFileObj["json"]);
    }

    parseJsonObject(jsonObj: Object) {
        this.webServer = this.parseServerFromJson("webServer", jsonObj["webServer"]);
        this.hotUpdateServer = this.parseServerFromJson("hotUpdateServer", jsonObj["hotUpdateServer"]);
        this.hotUpdateServerFiles = this.parseServerFilesFromJson("hotUpdateServer", jsonObj["files"]["hotUpdateServer"]);
        this.hotUpdateServerFiles.setServer(this.hotUpdateServer);
    }


    /*******************************
     *          解析Json
     *******************************/
    /**
     * 解析服务器列表信息
     * @param name 服务器名称
     * @param object 
     */
    parseServerListFromJson(name: string, object: Object): ServerInfo[] {
        if (!object) {
            return [];
        }
        if (!object.hasOwnProperty("domain")) {
            return [new ServerInfo(name, undefined, object["port"])];
        }
        let serverList: ServerInfo[] = [];
        let domainString: string = object["domain"].trim();
        let port: number = object["port"]
        let domainList: string[] = domainString.split(",");
        domainList.forEach((domain: string) => {
            let serverInfo = new ServerInfo(name, domain, port);
            serverList.push(serverInfo);
        });
        return serverList;
    }

    /**
     * 解析单个服务器信息
     * @param name 服务器名称
     * @param object 
     * @returns 
     * 解析成功返回ServerInfo
     * 解析失败返回undefined
     */
    parseServerFromJson(name: string, object: Object): ServerInfo {
        if (!object) {
            return undefined;
        }
        if (!object.hasOwnProperty("domain")) {
            return new ServerInfo(name, undefined, object["port"], object["yxdTag"]);
        }
        let domainString: string = object["domain"].trim();
        let port: number = object["port"]
        let domainList: string[] = domainString.split(",");
        if (domainList.length > 0) {
            return new ServerInfo(name, domainList[0], port, object["yxdTag"]);
        }
        return undefined;
    }

    /**
     * 解析服务器文件信息
     * @param name 
     * @param object 
     */
    parseServerFilesFromJson(name: string, object: Object): ServerFilesInfo {
        let filesInfo = new ServerFilesInfo(name);
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const element: Object = object[key];
                filesInfo.addFile(key, element);
            }
        }
        return filesInfo;
    }

}
