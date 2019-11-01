// websocket套接字应用层客户端
// 继承于WebSocketCore

// Feature:
// 1. keepalive/heartbeat
// 2. autoReconnect

import WebSocketCore from "./WebSocketCore";
import Global from "../../../Game/Global";
import Logger from "../../../Utils/Logger";
import { EnumSocketStatus } from "../../Enum/EnumNetwork";

export default class WebSocketClient extends WebSocketCore {

    // 断线重新:缓存
    private _autoReconnectCached: Boolean = false;
    // 断线重新
    private _autoReconnect: Boolean = false;
    // 心跳包
    private _heartBeatPack: any = undefined;
    // 心跳频率
    private _keepAliveInterval: number = 35;
    // 心跳定时器
    private _keepAliveTimer: number = 0;
    // 重连次数
    private _reconnectCount: number = 0;
    // 重连最大次数
    private _reconnectMaxCount: number = 0;
    // 断线重连中
    private _isReconnect = false;
    private _lastSendMessage = undefined;    // 上一条发送的消息
    // 发送失败的协议
    private _sendFailedMessage = undefined;
    // 发送消息超时计时器
    private _sendTimeoutTimer = 0;
    // 发送消息超时时间
    private _sendTimeot = 30;
    // 发送超时回调
    private _sendTimeoutCallback = undefined;

    // 回调函数
    private _onReconnect: Function;
    private _onReconnectExcceed: Function;

    init() {
        this._heartBeatPack = new Int8Array();
        this._keepAliveInterval = Global.networkConfig.keepAliveInterval;
        this._reconnectMaxCount = Global.networkConfig.reconnectMaxCount;
        this._sendTimeot = Global.networkConfig.sendMessageTimeot;
    }

    setReconnectCallbacks(onReconnect, onReconnectExcceed){
        this._onReconnect = onReconnect;
        this._onReconnectExcceed = onReconnectExcceed;
    }

    setReconnect(is_reconnect) {
        this._autoReconnect = is_reconnect;
    }

    public get isReconnect(): boolean {
        return this._isReconnect
    }

    /**
     * 保持心跳
     */
    private keepAlive() {
        this.send(this._heartBeatPack);
        Logger.log("keepAlive", this.getState())
        this.stopAlive();
        if (this._keepAliveTimer == 0) {
            this._keepAliveTimer = setInterval(this.keepAlive.bind(this), this._keepAliveInterval * 1000);
        }
    }

    private stopAlive() {
        if (this._keepAliveTimer) {
            clearInterval(this._keepAliveTimer);
            this._keepAliveTimer = 0;
        }
    }

    connect(host: string, port: number): void {
        super.connect(host, port);
        this._isReconnect = false;
    }

    reConnect() {
        let state = this.getState();
        if (state == EnumSocketStatus.open || state == EnumSocketStatus.connecting) {
            return false;
        } else {
            if (this._reconnectMaxCount <= this._reconnectCount) {
                if(this._onReconnectExcceed){
                    this._onReconnectExcceed();
                }
                return;
            }
            if(this._onReconnect){
                if(this._onReconnect()){
                    return;
                }
            }
            this.connect(this.host, this.port);
            this._reconnectCount += 1;
            this._isReconnect = true;
            Logger.warn("network reconnect", this.host, this.port);
        }
        return true;
    }

    resetReconnect() {
        this._isReconnect = false;
        this._reconnectCount = 0;
    }

    // return boolean 是否发送成功
    send(message: any): boolean {
        let ret = super.send(message);
        if (!ret){
            if(!this._sendFailedMessage) {
                this._sendFailedMessage = message;
            }else{
                Logger.warn("skip send message");
            }
        }else if(this._autoReconnect){
            this.reConnect();
        }
        if(ret){
            this._lastSendMessage = message;
            // this._startSendTimeoutTimer();
        }
        return ret;
    }

    // 重发上一条消息
    resendLastMessage(): boolean{
        let message = this._lastSendMessage;
        if(message){
            this._lastSendMessage = undefined;
            Logger.warn("resend last message");
            return this.send(message);
        }
        return false;
    }

    setSendTimeoutCallback(callback){
        this._sendTimeoutCallback = callback;
    }

    private _startSendTimeoutTimer(){
        this._clearSendTimeoutTimer();
        this._sendTimeoutTimer = setTimeout(this._onSendTimeout.bind(this), this._sendTimeot * 1000);
    }

    private _clearSendTimeoutTimer(){
        if(this._sendTimeoutTimer){
            clearTimeout(this._sendTimeoutTimer);
            this._sendTimeoutTimer = 0;
        }
    }

    private _onSendTimeout(){
        if(this._sendTimeoutCallback){
            this._sendTimeoutCallback();
        }
    }

    onopen(e) {
        super.onopen(e);
        this.keepAlive();
        this._isReconnect = false;
        this._reconnectCount = 0;
        if (this._sendFailedMessage) {
            if (this.send(this._sendFailedMessage)) {
                this._sendFailedMessage = undefined;
            }
        }
    }

    onclose(e) {
        this._clearSendTimeoutTimer();
        this.stopAlive();
        super.onclose(e);
        if (this._autoReconnect) {
            this.reConnect();
        }
    }

    onerror(e) {
        super.onerror(e);
    }

    close() {
        this._clearSendTimeoutTimer();
        this.stopAlive();
        this._autoReconnectCached = this._autoReconnect;
        this._autoReconnect = false;
        super.close();
        this._autoReconnect = this._autoReconnectCached;
    }

    onmessage(e){
        this._clearSendTimeoutTimer();
        super.onmessage(e);
    }

    onDestroy() {
        super.onDestroy();
    }


}