import AssetsVersionConst from "../Const/AssetsVersionConst";
import Logger from "../../Utils/Logger";
import Global from "../Global";
import { ServerFilesInfo } from "../DataStruct/ServerInfo";
import { EnumHotUpdateServerFile } from "../Enum/EnumServerInfo";
import DateUtil from "../../Utils/DateUtil";
import AssetsVersionManager from "../AssetManager/AssetsVersionManager";

/**
 * 资源Manifest工具
 * 
 */

export default class AssetsManifestUtil {

    /**
     * 重写本地缓存的project manifest
     * @param assetsDir 
     */
    static rewriteProjectManifestFromServer(assetsDirName: string) {
        let templatePath: string = Global.pathConfig.getPathRelativeWritablePath(AssetsVersionConst.writableProjectManifestPathTemplate);
        let templateTempAssetDir: string = Global.pathConfig.getPathRelativeWritablePath(AssetsVersionConst.tempRemoteAssetDirNameTemplate);
        let path: string = templatePath.replace("{ASSETS_DIR}", assetsDirName);
        let tempAssetDir: string = templateTempAssetDir.replace("{ASSETS_DIR}", assetsDirName);
        if (jsb.fileUtils.isDirectoryExist(path)) {
            let projectJson: object = {};

            let projectManifestString: string = jsb.fileUtils.getStringFromFile(path);
            try {
                projectJson = JSON.parse(projectManifestString);
                let packageUrl: string = projectJson["packageUrl"];
                projectJson = AssetsManifestUtil.updateManifestJsonUrlFromServer(projectJson, assetsDirName);
                let newPackageUrl: string = projectJson["packageUrl"];
                if (packageUrl != newPackageUrl) {
                    if (jsb.fileUtils.isDirectoryExist(tempAssetDir)) {
                        jsb.fileUtils.removeDirectory(tempAssetDir);
                    }
                }
            } catch (error) {
                projectJson = AssetsManifestUtil.getDefaultManifestObject();
            }

            let newJsonString: string = JSON.stringify(projectJson);
            jsb.fileUtils.writeStringToFile(newJsonString, path);
        }
    }


    /**
     * 更新manifest对象的服务器域名
     * @param assetsDir 
     */
    static updateManifestJsonUrlFromServer(obj: Object, assetsDir: string): Object {
        let hotUpdateServerFiles: ServerFilesInfo = Global.networkConfig.serverConfig.hotUpdateServerFiles;
        let packagePath = hotUpdateServerFiles.getFileHttpUrl(EnumHotUpdateServerFile.package);
        let versionManifestPath = hotUpdateServerFiles.getFileHttpUrl(EnumHotUpdateServerFile.version);
        let projectManifestPath = hotUpdateServerFiles.getFileHttpUrl(EnumHotUpdateServerFile.project);

        packagePath = packagePath.replace("{ASSETS_DIR}", assetsDir);
        versionManifestPath = versionManifestPath.replace("{ASSETS_DIR}", assetsDir);
        projectManifestPath = projectManifestPath.replace("{ASSETS_DIR}", assetsDir);

        obj["packageUrl"] = packagePath;
        obj["remoteManifestUrl"] = projectManifestPath + "?t=" + DateUtil.now();
        obj["remoteVersionUrl"] = versionManifestPath + "?t=" + DateUtil.now();
        return obj;
    }

    /**
     * 更新json object的服务器域名
     * @param 
     */
    static updateJsonObjectUrl(obj: Object, assetsDir: string, url: string): Object {
        let hotUpdateServerFiles: ServerFilesInfo = Global.networkConfig.serverConfig.hotUpdateServerFiles;
        let packagePath = url + "/" + hotUpdateServerFiles.getFile(EnumHotUpdateServerFile.package);
        let versionManifestPath = url + "/" + hotUpdateServerFiles.getFile(EnumHotUpdateServerFile.version);
        let projectManifestPath = url + "/" + hotUpdateServerFiles.getFile(EnumHotUpdateServerFile.project);
        packagePath = packagePath.replace("{ASSETS_DIR}", assetsDir);
        versionManifestPath = versionManifestPath.replace("{ASSETS_DIR}", assetsDir);
        projectManifestPath = projectManifestPath.replace("{ASSETS_DIR}", assetsDir);

        obj["packageUrl"] = packagePath;
        obj["remoteManifestUrl"] = projectManifestPath + "?t=" + DateUtil.now();
        obj["remoteVersionUrl"] = versionManifestPath + "?t=" + DateUtil.now();
        return obj;
    }

    /**
     * 获取原始的manifest对象
     * @param assetsDir 
     */
    static getRawProjectManifestJson(assetsDir: string): Object {
        let path: string = AssetsVersionConst.rawProjectManifestPath.replace("{ASSETS_DIR}", assetsDir);
        path = cc.url.raw(path);

        let obj: Object = AssetsManifestUtil.getDefaultManifestObject();
        if (jsb.fileUtils.isFileExist(path)) {
            let manifestString: string = jsb.fileUtils.getStringFromFile(path);
            try {
                obj = JSON.parse(manifestString);
            } catch (error) {
                Logger.error(`parse manifest failed! error: ${error} path: ${path}`);
            }
        }
        return obj;
    }


    // 获取默认的manifest
    static getDefaultManifestObject(): Object {
        let obj: Object = {}
        obj = {};
        obj["version"] = AssetsVersionConst.DEFAULT_VERSION;
        obj["assets"] = {};
        obj["searchPaths"] = [];
        return obj;
    }


    // 比较两个版本号大小
    // 1: A > B
    // 0: A = B
    // -1: A < B
    static compareVersion(versionA: string, versionB: string): number {
        let dotVersionA: string[] = versionA.split(".");
        let dotVersionB: string[] = versionB.split(".");
        if (dotVersionA.length != dotVersionB.length) {
            if (dotVersionA.length > dotVersionB.length) {
                return 1;
            } else {
                return -1;
            }
        }
        for (let index = 0; index < dotVersionA.length; index++) {
            const versionStrA: string = dotVersionA[index];
            const versionStrB: string = dotVersionB[index];
            if (versionStrA != versionStrB) {
                try {
                    let numberVersionA: number = parseInt(versionStrA);
                    let numberVersionB: number = parseInt(versionStrB);
                    if (numberVersionA > numberVersionB) {
                        return 1;
                    } else if (numberVersionA < numberVersionB) {
                        return -1;
                    }
                } catch (error) {
                    if (versionStrA > versionB) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            }
        }

        return 0;
    }

    // 只要不同就热更新，小于0则需要更新
    static versionCompareHandle(versionA: string, versionB: string): number {
        let dotVersionA: string[] = versionA.split(".");
        let dotVersionB: string[] = versionB.split(".");
        if (dotVersionA.length != dotVersionB.length) {
            return -1;
        }
        if (versionA != versionB) {
            return -1;
        }
        return 0;
    }


    // app是否需要升级，暂时判断第一位和第二位
    static appUpgradeCompareHandle(versionA: string, versionB: string): boolean {
        let dotVersionA: string[] = versionA.split(".");
        let dotVersionB: string[] = versionB.split(".");
        if (dotVersionA.length != dotVersionB.length) {
            return true;
        }
        if (dotVersionA.length > 0) {
            if (dotVersionA[0] < dotVersionB[0]) {
                return true;
            }
        }
        if (dotVersionA.length > 1) {
            if (dotVersionA[1] < dotVersionB[1]) {
                return true;
            }
        }

        return false;
    }


}