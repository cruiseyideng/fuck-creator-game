import { EnumSocketStatus } from "../../Enum/EnumNetwork";

// websocket套接字应用层核心接口

export default class WebSocketCore {

    host: string = "";
    port: number = 0;

    private socket = undefined;

    private onConnectCb: Function;
    private onCloseCb: Function;
    private onSocketDataCb: Function;
    private onErrorCb: Function;
    private thisObject: any;

    setCallBacks(onConnectCb: Function, onCloseCb: Function, onSocketDataCb: Function, onErrorCb: Function, thisObject: any): void {
        this.onConnectCb = onConnectCb;
        this.onCloseCb = onCloseCb;
        this.onSocketDataCb = onSocketDataCb;
        this.onErrorCb = onErrorCb;
        this.thisObject = thisObject;
    }

    connect(host: string, port: number): void {
        this.host = host;
        this.port = port;

        if (this.socket) {
            this.closeSocket();
        }
        let socketServerUrl = "ws://" + this.host + ":" + this.port;
        this.socket = new window["WebSocket"](socketServerUrl);
        this.socket.binaryType = "arraybuffer";
        this.bindEvent();
    }

    connectByUrl(url: string): void {
        this.close();
        this.socket = new window["WebSocket"](url);
        this.socket.binaryType = "arraybuffer";
        this.bindEvent();
    }

    private bindEvent(): void {
        let socket = this.socket;
        socket.onopen = this.onopen.bind(this);
        socket.onclose = this.onclose.bind(this);
        socket.onerror = this.onerror.bind(this);
        socket.onmessage = this.onmessage.bind(this);
    }

    onopen(e) {
        if (this.onConnectCb) {
            this.onConnectCb.call(this.thisObject);
        }
    }

    onclose(e) {
        if (this.onCloseCb) {
            this.onCloseCb.call(this.thisObject, e);
        }
    }

    onerror(e) {
        if (this.onErrorCb) {
            this.onErrorCb.call(this.thisObject, e);
        }
    }

    onmessage(e) {
        if (this.onSocketDataCb) {
            this.onSocketDataCb.call(this.thisObject, e.data);
        }
    }

    // return boolean 是否发送成功
    send(message: any): boolean {
        if (this.socket && this.getState() == EnumSocketStatus.open) {
            this.socket.send(message);
            return true;
        } else {
            return false;
        }
    }

    getState() {
        if (this.socket) {
            return this.socket.readyState;
        }
        return EnumSocketStatus.closed;
    }

    private closeSocket() {
        if (this.socket) {
            let readyState = this.socket.readyState;
            if (readyState == EnumSocketStatus.open || readyState == EnumSocketStatus.connecting) {
                this.socket.close();
            }
        }
        this.socket = undefined;
    }

    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = undefined;
        }
    }

    onDestroy() {
        this.close();
    }

}