import Logger from "../../Utils/Logger";
import UITools from "../../Utils/UITools";

export default class EventManager {
    public static instance: EventManager = new EventManager();

    private callbackList = {};

    public constructor() {

    }

    //注册事件
    public addListener(eventName, callback, caller) {
        if (this.callbackList[eventName]) {
            var funlist = this.callbackList[eventName];
            funlist.push([callback, caller]);
            this.callbackList[eventName] = funlist;
        }
        else {
            this.callbackList[eventName] = [[callback, caller]];
        }
    }

    public removeListener(eventName, callback, caller = undefined) {
        if (this.callbackList[eventName]) {
            for (let i = this.callbackList[eventName].length - 1; i >= 0; i--) {
                let callinfo = this.callbackList[eventName][i]
                if (callinfo[0] == callback && callinfo[1] == caller) {
                    this.callbackList[eventName].splice(i, 1);
                    break;
                }
                // else {
                //     Logger.warn("removeListener fail:" + eventName + ", callinfo[0]:" + callinfo[0] + ", callback:" + callback);
                // }
            }
        }

    }

    public dispatchEvent(eventName, parameter?: any, ...restOfName: any[]) {
        var callback = this.callbackList[eventName];
        if (callback) {
            let new_callback = callback.slice(0, callback.length);
            for (var i = 0; i < new_callback.length; i++) {
                var callInfo = new_callback[i];
                callInfo[0].call(callInfo[1], parameter, ...restOfName);
            }
        }
    }

    public addBtnEvent(parentNode: cc.Node, objectNode: cc.Node, scriptName: string, eventName: string, data: any = null) {
        let btn: cc.Button = objectNode.getComponent(cc.Button);
        if (UITools.IsNal(btn)) {
            btn = objectNode.addComponent(cc.Button);
        }
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = parentNode; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = scriptName;//这个是代码文件名
        clickEventHandler.handler = eventName;
        clickEventHandler.customEventData = data;
        btn.clickEvents.push(clickEventHandler);
        this.addBtnEffect(objectNode);
    }

    public removeBtnEffect(objectNode: cc.Node) {
        var b = objectNode.getComponent(cc.Button);
        b.transition = cc.Button.Transition.NONE;
    }

    public addBtnEffect(objectNode: cc.Node, scale: number = 1.1) {
        var b = objectNode.getComponent(cc.Button);
        b.transition = cc.Button.Transition.SCALE;
        b.zoomScale = scale;
    }

    public addBtnColorEffect(objectNode: cc.Node, normalC: cc.Color, pressC: cc.Color) {
        var b = objectNode.getComponent(cc.Button);
        b.transition = cc.Button.Transition.COLOR;
        b.normalColor = normalC;
        b.pressedColor = pressC;
    }

    public addSliderEvent(parentNode: cc.Node, objectNode: cc.Node, EventName: string, data: any) {
        var b = objectNode.getComponent(cc.Slider);
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = parentNode; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = parentNode.name;//这个是代码文件名
        clickEventHandler.handler = EventName;
        clickEventHandler.customEventData = data;
        b.slideEvents.push(clickEventHandler);
    }
}
