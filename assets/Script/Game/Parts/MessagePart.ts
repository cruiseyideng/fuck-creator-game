import Part from "../../Core/Part";
import { EnumEvents } from "../Enum/EnumEvents";
import Global from "../Global";
import { EnumNetworkName } from "../../Core/Enum/EnumNetwork";

/**
 * 服务器到客户端的双向消息通信
 */

export default class MessagePart extends Part {

    protoHandlers: Object = {};

    init() {
        super.init();
        this.addListener(EnumEvents.NetWorkSocketData, this.dispatch, this);
    }

    add(messageType: number, callback: Function, networkName: EnumNetworkName = EnumNetworkName.Default) {
        let handlers: Object[] = this.protoHandlers[messageType];
        if (!handlers) {
            handlers = [];
            this.protoHandlers[messageType] = handlers;
        }
        handlers.push({ "func": callback, "name": networkName });
    }

    dispatch(messageType: number, protoObj: Object, networkName: string) {
        let handlers: Object[] = this.protoHandlers[messageType];
        if (handlers) {
            for (const iterator of handlers) {
                if (iterator["name"] == networkName) {
                    let func: Function = iterator["func"];
                    func(protoObj, messageType);
                }
            }
        }
    }

    send(pack: any, type: number, networkName: EnumNetworkName = EnumNetworkName.Default) {
        let networkMgr = Global.networkMgr;
        if (networkName != EnumNetworkName.Default) {
            networkMgr = Global.multiNetFactory.createOrGetMgr(networkName);
        }
        networkMgr.sendMessage(pack, type);
    }

}