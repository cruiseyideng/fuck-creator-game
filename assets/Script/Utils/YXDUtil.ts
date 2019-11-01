import Global from "../Game/Global";
import Logger from "./Logger";

/**
 * 游戏盾工具
 */

export default class YXDUtil {

    static token: string = "";
    static appKey: string = "";

    static init() {
        window["YXDUtil"] = this;
    }

    static setAppKeyToken(appKey, token) {
        this.token = token;
        this.appKey = appKey;
    }

    static initEx() {
        if (!cc.sys.isNative) {
            return 2;
        }
        if (cc.sys.os == cc.sys.OS_IOS) {
            return 3;
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            // 失败返回1
            let ret: number = jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/YxdSdkUtil",
                "initEx", "(Ljava/lang/String;Ljava/lang/String;)I",
                this.appKey,
                this.token
            );
            return ret;
        }
    }

    static getProxyTcpByDomain(group_name, ddomain, dport) {
        if (!cc.sys.isNative) {
            return undefined;
        }
        if (cc.sys.os == cc.sys.OS_IOS) {
            return undefined;
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            let retStr: String = jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/YxdSdkUtil",
                "getProxyTcpByDomain", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;",
                this.token,
                group_name,
                ddomain,
                dport
            );
            let retValues = retStr.split("_");
            let ret = parseInt(retValues[0]);
            let ip = retValues[1];
            let port = parseInt(retValues[2]);
            return {
                ret: ret,
                ip: ip,
                port: port
            };
        }
    }

    static getProxyTcpByIp(group_name, dip, dport) {
        if (!cc.sys.isNative) {
            return undefined;
        }
        if (cc.sys.os == cc.sys.OS_IOS) {
            return undefined;
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            let retStr: String = jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/YxdSdkUtil",
                "getProxyTcpByIp", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;",
                this.token,
                group_name,
                dip,
                dport
            );

            let retValues = retStr.split("_");
            let ret = parseInt(retValues[0]);
            let ip = retValues[1];
            let port = parseInt(retValues[2]);
            return {
                ret: ret,
                ip: ip,
                port: port
            };
        }
    }

}