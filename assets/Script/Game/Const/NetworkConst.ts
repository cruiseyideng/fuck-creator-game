/**
 * 网络相关常量
 */

 export default class NetworkConst {

    static readonly sendTimeoutMilliSeconds: number = 7000;      // 发送超时时间
    static readonly connectTimeoutMilliSeconds: number = 20000;   // 连接超时时间
    static readonly heartBeatTimeoutMiliSeconds: number = 10000; // 心跳超时时间
    static readonly gameStatusNoRightRestartTimes: number = 2;    // 心跳返回游戏类型不对次数，重启游戏
    static readonly guestRegisterRetryTimes: number = 3;    // 游客注册日志上传重试次数

 }