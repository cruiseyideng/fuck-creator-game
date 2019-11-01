// 网络管理
import Global from "../Global";
import Logger from "../../Utils/Logger";
import { EnumEvents } from "../Enum/EnumEvents";
import WebSocketClient from "../../Core/Network/WebSocket/WebSocketClient";
import { EnumNetworkName } from "../../Core/Enum/EnumNetwork";

export default class NetworkManager {

    webSocketClient: WebSocketClient;

    private _showTips: boolean = true;
    private _name: string;
    private _ignoreMessageMap = {};

    constructor(name: EnumNetworkName = EnumNetworkName.Default) {
        this._name = name;
    }

    getName() {
        return this._name;
    }

    set showTips(value: boolean) {
        this._showTips = value;
    }

    init() {
        this.initWebSocketClient();
    }

    initWebSocketClient() {
        this.webSocketClient = new WebSocketClient();
        this.webSocketClient.setReconnect(false);
        this.webSocketClient.setCallBacks(this.onConnect, this.onClose, this.onSocketData, this.onError, this);
        this.webSocketClient.setReconnectCallbacks(this.onNetworkReconnect.bind(this), this.onNetworkReconnectExceed.bind(this))
        this.webSocketClient.setSendTimeoutCallback(this.onSendTimeout.bind(this));
        this.webSocketClient.init();
    }

    private onNetworkReconnect() {
        this.dispatchEvent(EnumEvents.NetWorkReconnect);
    }

    private onNetworkReconnectExceed() {
        this.dispatchEvent(EnumEvents.NetWorkReconnectExceed);
    }

    private onReconnectExceedSure() {
        this.webSocketClient.resetReconnect();
        this.webSocketClient.reConnect();
    }

    private onSendTimeout() {
    }

    private onSendTimeoutResendSure() {
        this.webSocketClient.resendLastMessage();
    }

    connect(host: string, port: number, autoReconnect: boolean = false) {
        this.webSocketClient.close();
        this.webSocketClient.connect(host, port);
        this.webSocketClient.setReconnect(autoReconnect);
        Logger.warn("network connect", this._name, host, port, autoReconnect);
    }

    closeConnect() {
        Logger.log("network close:", this._name);
        this.webSocketClient.close();
    }

    dispatchEvent(enumEvent: EnumEvents, ...params) {
        Global.eventMgr.dispatchEvent(enumEvent, ...params);
    }

    sendMessage(object: Object, messageType: number) {
    }

    private onConnect() {
        Logger.log("network connected", this._name);
        this.dispatchEvent(EnumEvents.NetWorkConnectSuccess, this.webSocketClient.isReconnect, this._name);
    }

    private onClose() {
        Logger.log("network onclose", this._name);
        this.dispatchEvent(EnumEvents.NetWorkConnectClose, this._name);
    }

    private onError(e) {
        Logger.log("network error:", this._name, e);
        this.dispatchEvent(EnumEvents.NetWorkConnectError, e, this._name);
    }

    private onSocketData(data: ArrayBuffer) {
        Logger.log("network onSocketData:", this._name);
    }

}