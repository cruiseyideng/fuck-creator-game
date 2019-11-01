import Global from "../Game/Global";
import Entity from "./Entity";
import MessagePart from "../Game/Parts/MessagePart";
import { EnumPart } from "../Game/Enum/EnumPart";
import EventManager from "./Manager/EventManager";
import { EnumNetworkName } from "./Enum/EnumNetwork";
import Logger from "../Utils/Logger";

/**
 * 部件
 */

export default class Part extends cc._BaseNode {

    entity: Entity;
    eventDict: Object = {};
    messagePart: MessagePart = undefined;

    private _inited: boolean = false;
    private _postInited: boolean = false;
    private _started: boolean = false;
    private _destroyed: boolean = false;

    init() {
        this._inited = true;
    }

    initFromDict(data) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }

    postInit() {
        this._postInited = true;
    }

    start() {
        this._started = true;
    }

    /**
     * 1. 不允许同名eventName注册多次
     * 2. 不带入caller则默认this
     **/
    addListener(eventName: string, callback: Function, caller: Object = undefined) {
        if (caller == undefined) {
            caller = this;
        }
        Global.eventMgr.addListener(eventName, callback, caller);
        this.eventDict[eventName] = [callback, caller];
    }

    /**
     * 1. 不带入caller则默认this
     */
    removeListener(eventName: string, callback: Function, caller: Object = undefined) {
        if (caller == undefined) {
            caller = this;
        }
        Global.eventMgr.removeListener(eventName, callback, caller);
        let info = this.eventDict[eventName];
        if (info[0] == callback && info[1] == caller) {
            this.eventDict[eventName] = undefined;
        }
    }

    /**
     * 调用entity其他Part
     * @param enumPart 
     * @param func_name 
     * @param params 
     */
    callOtherPart(enumPart: EnumPart, func_name: string, ...params) {
        let part: Part = this.entity.getPart(enumPart)
        if (part) {
            let func = part[func_name];
            if (func) {
                return {
                    result: func.call(part, ...params),
                    return: true
                };
            } else {
                Logger.error("call other part but func is not found on part!", enumPart, func_name)
            }
        } else {
            Logger.error("call other part but part is not found!", enumPart)
        }
        return {
            result: undefined,
            return: false
        };
    }

    addMessage(messageType: number, callback: Function, networkName: EnumNetworkName = EnumNetworkName.Default) {
        if (!this.messagePart) {
            this.requirePart(EnumPart.MessagePart);
            this.messagePart = this.entity.getPart<MessagePart>(EnumPart.MessagePart);
        }
        this.messagePart.add(messageType, callback, networkName);
    }

    requirePart(partNo: number) {
        if (!this.entity.hasPart(partNo)) {
            this.entity.addPart(partNo);
        }
    }

    sendMessage(pack: any, type: number, networkName: EnumNetworkName = EnumNetworkName.Default) {
        if (!this.messagePart) {
            this.messagePart = this.entity.getPart<MessagePart>(EnumPart.MessagePart);
            if (!this.messagePart) {
                this.entity.addPart(EnumPart.MessagePart);
            }
        }
        if (this.messagePart) {
            this.messagePart.send(pack, type, networkName);
        }
    }

    isInit() {
        return this._inited;
    }

    isPostInit() {
        return this._postInited;
    }

    isStart() {
        return this._started;
    }

    isDestroyed() {
        return this._destroyed;
    }

    onDestroy() {
        if (this._destroyed) {
            return;
        }
        let eventMgr: EventManager = Global.eventMgr;
        for (const key in this.eventDict) {
            let info: object = this.eventDict[key];
            eventMgr.removeListener(key, info[0], info[1]);
        }
        this.eventDict = {};
        this.entityEventDict = {};
        this._destroyed = true;
    }

}