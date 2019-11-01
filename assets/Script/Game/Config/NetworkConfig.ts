import ServerConfig from "./ServerConfig";
import { EnumLocalStorageKey } from "../Enum/EnumLocalStorageKey";
import Global from "../Global";
import LocalStorage from "../../Utils/LocalStorage";

/**
 * 网络配置
 */

export default class NetworkConfig {

    serverConfig: ServerConfig;     // 服务器配置
    publicIp: string;               // 公网IP

    logProto: boolean = true;       // log输出协议

    keepAliveInterval: number = 0;  // 网络心跳频率/秒数
    reconnectMaxCount: number = 10; // 网络重连最大次数
    sendMessageTimeot = 30;         // 发送消息超时时间
    ignoreMessageMap = {};          // 不处理的消息表。命名空间：消息列表【16进制字符串】
    nonInheritGameFactoryServers: string[] = []; // 不继承于GameFactory的游戏服

    constructor() {
        this.serverConfig = new ServerConfig();
        Global.serverConfig = this.serverConfig;
    }

    init() {
        this.serverConfig.init();
        this.publicIp = LocalStorage.getString(EnumLocalStorageKey.PUBLIC_IP);

        let jsonAsset: cc.JsonAsset = Global.loaderMgr.getCacheObject(Global.pathConfig.networkPath) as cc.JsonAsset;
        this.initFromNetworkConfig(jsonAsset.json);
    }

    initFromNetworkConfig(jsonObj: Object) {
        this.keepAliveInterval = jsonObj["keepAliveInterval"];
        this.reconnectMaxCount = jsonObj["reconnectMaxCount"];
        this.sendMessageTimeot = jsonObj["sendMessageTimeot"];
        this.ignoreMessageMap = jsonObj["ignoreMessageMap"];
        this.nonInheritGameFactoryServers = jsonObj["nonInheritGameFactoryServers"];
    }

    setPublicIp(ip: string) {
        this.publicIp = ip;
        if (this.publicIp) {
            LocalStorage.setString(EnumLocalStorageKey.PUBLIC_IP, this.publicIp);
        }
    }

    // 是否继承于GameFactory
    isInheritGameFactory(serverName: string){
        return this.nonInheritGameFactoryServers.indexOf(serverName) == -1;
    }
}