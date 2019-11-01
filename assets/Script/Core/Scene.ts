import Global from "../Game/Global";
import UITools from "../Utils/UITools";
import BaseView from "./UI/BaseView";
import EventManager from "./Manager/EventManager";

/**
 * 场景
 * TODO: Scene被占用了，所以命名BaseScene
 */

export default class Scene {
    sceneName: string = "";     // 场景资源名
    eventDict: Object = {};
    viewList: BaseView[] = [];

    constructor(name: string = "") {
        this.sceneName = name;
    }

    init() {
        if (cc.director.getScene().name == this.sceneName || this.sceneName == "") {
            this.onLoad();
            return;
        }
        Global.gUIMgr.showPrepareMask("加载场景");
        Global.loaderMgr.sceneSwitch(this.sceneName, [], (error) => {
            Global.gUIMgr.hidePrepareMask();
            this.onLoad();
        }, false);
    }

    onLoad() {
        if (Global.world) {
            Global.world.onLoad();
        }
        Global.world.postInit();
    }

    start() {
    }

    findChild(path: string, comp: any = undefined): cc.Node | cc.Component {
        return UITools.FindChild(cc.director.getScene(), path, comp);
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

    // 场景中的节点BaseView
    createView(node: any, viewClass: any): BaseView {
        let view: BaseView = Object.create(viewClass.prototype);
        view.constructor();
        view.create(node);
        view.rootComponent.setView(view);
        this.viewList.push(view);
        return view;
    }

    onDestroy() {
        let eventMgr: EventManager = Global.eventMgr;
        for (const key in this.eventDict) {
            let info: object = this.eventDict[key];
            eventMgr.removeListener(key, info[0], info[1]);
        }
        this.eventDict = {};
        for (const view of this.viewList) {
            view.removeRootWithoutDestroy();
            view.onDestroy();
        }
        this.viewList = [];
    }

}