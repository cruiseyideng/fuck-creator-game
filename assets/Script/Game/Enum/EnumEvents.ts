/**
 * 所有的时间枚举值
 */

export enum EnumEvents {
    // 网络事件
    // 网络连接成功事件 参数1：是否断线重连is_reconnect
    NetWorkConnectSuccess = "NetWorkConnectSuccess",
    NetWorkConnectError = "NetWorkConnectError",
    NetWorkConnectClose = "NetWorkConnectClose",
    NetWorkSocketData = "NetWorkSocketData",
    NetWorkReconnect = "NetWorkReconnect",
    NetWorkReconnectExceed = "NetWorkReconnectExceed",
    // 多网络连接成功事件 参数1：是否断线重连is_reconnect
    MultiNetWorkConnectSuccess = "MultiNetWorkConnectSuccess",
    MultiNetWorkConnectError = "MultiNetWorkConnectError",
    MultiNetWorkConnectClose = "MultiNetWorkConnectClose",
    MultiNetWorkReconnect = "MultiNetWorkReconnect",
    MultiNetWorkReconnectExceed = "MultiNetWorkReconnectExceed",
}