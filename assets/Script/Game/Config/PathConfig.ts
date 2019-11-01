/**
 * 全局路径配置，需要初始化
 */

export default class PathConfig {

    launchPrerequisiteFiles: string[] = undefined;          // 启动需要的文件

    writablePath: string = "";                              // 用户可写目录
    networkPath: string = "Config/network";                   // 网络配置
    serverConfigPath: string = "Config/server";                   // 服务器配置
    languagePath: string = "Config/language";                   // 多语言配置

    constructor() {
        this.launchPrerequisiteFiles = [
            this.networkPath,
            this.serverConfigPath,
            this.languagePath
        ]
    }

    init() {
        if (cc.sys.isNative) {
            this.writablePath = jsb.fileUtils.getWritablePath();
        }
    }

    /**
     * 获取相对于可写路径的全路径
     * @param filePath 
     */
    getPathRelativeWritablePath(filePath: string) {
        return `${this.writablePath}/${filePath}`;
    }

    getRawPath(filePath: string) {
        return cc.url.raw(filePath);
    }

}