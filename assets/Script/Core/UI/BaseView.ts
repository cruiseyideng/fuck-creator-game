import UIInfo from "./UIInfo";
import Logger from "../../Utils/Logger";
import Global from "../../Game/Global";
import UIRootComponent from "./UIRootComponent";
import { EnumLayer } from "../../Game/Enum/EnumLayer";
import UITools from "../../Utils/UITools";
import { EnumButtonType } from "../../Game/Enum/EnumButtonType";
import ButtonConst from "../../Game/Const/ButtonConst";
import { EnumAudio } from "../../Game/Enum/EnumAudio";
import EventManager from "../Manager/EventManager";
import { EnumWindowAction } from "../../Game/Enum/EnumWindowAction";

/**
 * UI基类
 */

export enum EnumEditBoxEvent { didBegan, textChanged, edtitEnded, editReturn }
export default class BaseView extends cc._BaseNode {

    name: string;
    resPath: string;
    zIndex: number;
    selfActive: boolean = true;
    layer: EnumLayer;
    root: cc.Node;
    param: any;
    rootComponent: UIRootComponent;
    subViewDict: { [name: string]: BaseView; } = {};
    isDestroyed: boolean = false;
    clickType: EnumButtonType;
    eventDict: Object = {};
    maskNode: cc.Node;
    maskBtn: cc.Button;
    showMask: boolean = false;
    offsetPos: cc.Vec2 = cc.Vec2.ZERO;
    scale: number = 1;
    enumAction: EnumWindowAction = EnumWindowAction.None;
    isCreated: boolean = false;

    private _parent: any;

    constructor(info: UIInfo = undefined, name: string = undefined, resPath: string = undefined, zIndex: number = undefined, layer = undefined) {
        super();
        if (info == undefined) {
            return;
        }
        if (name != undefined) {
            this.name = name;
        } else {
            this.name = info.name;
        }
        if (resPath != undefined) {
            this.resPath = resPath;
        } else {
            this.resPath = info.resPath;
        }
        if (zIndex != undefined) {
            this.zIndex = zIndex;
        } else {
            this.zIndex = info.zIndex;
        }
        if (layer != undefined) {
            this.layer = layer;
        } else {
            this.layer = info.layer;
        }
    }

    create(node: cc.Node = undefined) {
        if (this.root != undefined) {
            return;
        }
        if (node) {
            this.root = node;
            // TODO：没处理persist
            this.onCreate();
            return;
        }
        Global.loaderMgr.loadRes(this.resPath, (errorMessage, loadedResource) => {
            if (this.isDestroyed) {
                return;
            }
            var parent = this.getParent();
            if (parent) {
                this.root = cc.instantiate<cc.Node>(loadedResource);
                parent.addChild(this.root, this.zIndex);
                this.root.setPosition(this.offsetPos);
                this.isCreated = true;
                this.onCreate();
            } else {
                Logger.error("create ui failed ! Canvas is undefined!! ", this.resPath);
            }
        });
    }

    setPersistRoot(isPersist) {
        if (isPersist) {
            if (!UITools.IsNal(this.root) && !UITools.IsNal(this.root.parent) && this.root.parent != this.getPersistRoot()) {
                this.root.parent = this.getPersistRoot();
            }
        } else if (!isPersist) {
            if (!UITools.IsNal(this.root) && !UITools.IsNal(this.root.parent) && this.root.parent != this.getParent()) {
                this.root.parent = this.getParent();
                this.root.zIndex = this.zIndex;
            }
        }
    }

    onCreate() {
        let comp: UIRootComponent = this.root.addComponent(UIRootComponent);
        comp.setView(this);
        this.rootComponent = comp;
        if (this.showMask && UITools.IsNal(this.maskNode)) {
            Global.loaderMgr.loadRes(Global.pathConfig.maskPrefabPath, (error, result) => {
                this.maskNode = cc.instantiate(result);
                this.maskBtn = this.maskNode.getComponent(cc.Button);
                this.root.addChild(this.maskNode, -10);
                this.addClickEvent(this.maskBtn, "onClickMaskBtn", EnumButtonType.none, EnumAudio.none);
            });
        }
        this._onLoad();
        this.setVisible(this.selfActive);
        this.setScale(this.scale);
    }

    /**点击遮罩 子类实现 */
    onClickMaskBtn() {

    }

    setParent(p) {
        this._parent = p;
    }

    getParent() {
        if (!UITools.IsNal(this._parent)) {
            return this._parent;
        }
        let canvas = cc.find("Canvas");
        let parent = canvas;
        if (this.layer != undefined) {
            parent = canvas.getChildByName(this.layer);
        }
        if (null != parent)
            return parent;
        return canvas;
    }

    getPersistRoot() {
        return cc.find("PersistRoot");
    }

    beforeVisible() {

    }
    beforeHide() {

    }

    setVisible(visible) {
        this.selfActive = visible;
        if (this.root) {
            if (visible) {
                this.beforeVisible();
            }
            else if (!visible) {
                this.beforeHide();
            }
            this.root.active = visible;
        }
    }

    setScale(scale) {
        this.scale = scale;
        if (this.root) {
            this.root.setScale(this.scale);
        }
    }

    addClickEvent(button: cc.Button, eventName: string, clickType: EnumButtonType = EnumButtonType.scale, sound: EnumAudio = EnumAudio.BtnClick_Sound, param: any = null) {
        this.setButtonType(button, clickType);
        this.rootComponent.addClickEvent(button, eventName, sound, param);
    }

    addEditBoxEvent(editBox: cc.EditBox, evtType: EnumEditBoxEvent, eventName: string, param = null) {
        this.rootComponent.addEditBoxEvent(editBox, evtType, eventName, param);
    }

    addSlideEvent(slider: cc.Slider, eventName: string, param: any = null) {
        this.rootComponent.addSlideEvent(slider, eventName, param);
    }

    /**
     * 设置按键效果
     * @param button 
     * @param clickType 放大缩小，改变颜色
     */
    setButtonType(button: cc.Button, clickType: EnumButtonType) {
        switch (clickType) {
            case EnumButtonType.scale:  //放大缩小
                button.transition = ButtonConst.scaleConfig.type;
                button.duration = ButtonConst.scaleConfig.duration;
                button.zoomScale = ButtonConst.scaleConfig.zoomScale;
                break;
            case EnumButtonType.color:  //改颜色
                button.transition = ButtonConst.colorConfig.type;
                button.duration = ButtonConst.colorConfig.duration;
                button.normalColor = ButtonConst.colorConfig.normal;
                button.pressedColor = ButtonConst.colorConfig.pressed;
                button.hoverColor = ButtonConst.colorConfig.hover;
                button.disabledColor = ButtonConst.colorConfig.disable;
                break;
            case EnumButtonType.none:    //无效果
                button.transition = ButtonConst.noneConfig.type;
                break;
        }
    }

    isOpen() {
        return this.selfActive;
    }

    _onLoad() {
        this.onLoad();
    }

    onLoad() {
        // OnLoad结束后立刻访问node会有出现undefined的情况
    }

    start() {
        // 逻辑开始的地方
    }

    update(dt) {

    }

    createSubView(name: string, parentRoot: cc.Node, cClass: any, pos: cc.Vec2 = cc.Vec2.ZERO, param: any = null) {
        let subView = this.subViewDict[name];
        if (null == subView) {
            subView = Object.create(cClass.prototype);
            subView.constructor(this.getSubUIInfo(name));
            subView.setParent(parentRoot);
            subView.offsetPos = pos;
            subView.param = param;
            subView.create();
            this.subViewDict[name] = subView;
        }
        return subView;
    }

    addSubView(name: string, cClass: any, root: cc.Node, param: any = null) {
        let subView = this.subViewDict[name];
        if (null == subView) {
            subView = Object.create(cClass.prototype);
            subView.constructor(this.getSubUIInfo(name));
            subView.root = root;
            subView.param = param;
            let comp: UIRootComponent = subView.root.addComponent("UIRootComponent");
            comp.setView(subView);
            subView.rootComponent = comp;
            subView.onLoad();
            this.subViewDict[name] = subView;
        }
        return subView;
    }

    getSubUIInfo(name: string) {
        let info: UIInfo = new UIInfo();
        info.name = name;
        info.resPath = "";
        info.zIndex = 0;
        return info;
    }

    getSubView(name: string) {
        let subView = this.subViewDict[name];
        if (null == subView) {
            Logger.error(name + " not found!!");
            return null;
        }
        return subView;
    }

    /**
     * TODO：如果有同名的node，getChildByName一定找不到第二个
     * @param path 
     * @param comp 
     */
    findChild(path: string, comp: any = undefined) {
        return UITools.FindChild(this.root, path);
    }

    /**
     * 计时器建议使用Global.timerMgr
     * @param func 
     * @param time 
     */
    setSchedule(func: Function, time: number, repeat: number = undefined) {
        this.rootComponent.schedule(func, time, repeat);
    }

    unSchedule(func: Function) {
        this.rootComponent.unschedule(func);
    }

    setScheduleOnce(func: Function, time: number) {
        this.rootComponent.scheduleOnce(func, time);
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

    removeRootWithoutDestroy() {
        if (this.root) {
            for (const key in this.subViewDict) {
                this.subViewDict[key].onDestroy();
            }
            this.subViewDict = null;
            this.root = undefined;
        }
    }

    onDestroy() {
        if (this.isDestroyed) {
            return;
        }
        this.isDestroyed = true;
        if (this.root) {
            for (const key in this.subViewDict) {
                this.subViewDict[key].onDestroy();
            }
            this.subViewDict = null;
            this.root.removeFromParent();
            this.root = undefined;
        }
        if (this.rootComponent) {
            this.rootComponent.onDestroy();
            this.rootComponent = undefined;
        }
        let eventMgr: EventManager = Global.eventMgr;
        for (const key in this.eventDict) {
            let info: object = this.eventDict[key];
            eventMgr.removeListener(key, info[0], info[1]);
        }
        this.eventDict = {};
    }

}