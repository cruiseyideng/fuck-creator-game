import NetworkManager from "./NetworkManager";
import { EnumNetworkName } from "../../Core/Enum/EnumNetwork";
import { EnumEvents } from "../Enum/EnumEvents";

// 多条网络连接实现类

export default class MultiNetworkManager extends NetworkManager {

    private _eventsOverride: Object = {};

    constructor(name: EnumNetworkName) {
        super(name);
        this._eventsOverride[EnumEvents.NetWorkConnectSuccess] = EnumEvents.MultiNetWorkConnectSuccess;
        this._eventsOverride[EnumEvents.NetWorkConnectError] = EnumEvents.MultiNetWorkConnectError;
        this._eventsOverride[EnumEvents.NetWorkConnectClose] = EnumEvents.MultiNetWorkConnectClose;
        this._eventsOverride[EnumEvents.NetWorkReconnect] = EnumEvents.MultiNetWorkReconnect;
        this._eventsOverride[EnumEvents.NetWorkReconnectExceed] = EnumEvents.MultiNetWorkReconnectExceed;
    }

    init() {
        super.init();
    }

    dispatchEvent(enumEvent: EnumEvents, ...params) {
        if (this._eventsOverride.hasOwnProperty(enumEvent)) {
            enumEvent = this._eventsOverride[enumEvent];
        }
        super.dispatchEvent(enumEvent, ...params);
    }

}