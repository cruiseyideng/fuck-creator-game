import Global from "../Game/Global";
import AdapterHelper from "../Utils/AdapterHelper";
import Entity from "./Entity";
import Scene from "./Scene";
import UIManager from "./Manager/UIManager";
import EventManager from "./Manager/EventManager";
import { EnumEntity } from "../Game/Enum/EnumEntity";

const { ccclass, property } = cc._decorator;


@ccclass
export default class World {

    public name: string = "World";
    public uiMgr: UIManager;
    public entity: Entity;
    public scene: Scene;
    public preloadAssets: string[] = [];

    private eventDict: Object = {};

    constructor() {
        this.entity = Global.entityManager.createEntity();
    }

    init() {
        let enumEntity = EnumEntity.None;
        let typeName = this.name;
        for (const key in EnumEntity) {
            if (key == typeName) {
                enumEntity = parseInt(EnumEntity[key]);
                break;
            }
        }
        Global.entityManager.initParts(this.entity, enumEntity);

        if (this.scene) {
            this.scene.init();
        } else {
            this.onLoad();
            this.postInit();
        }
    }

    postInit() {
        this.entity.init();
        this.start();
    }

    onLoad() {
        AdapterHelper.fixApdater();
        this.initUIMgr();
        if (this.uiMgr) {
            this.uiMgr.onLoad();
        }
        Global.uiMgr = this.uiMgr;
        this.entity.postInit();
    }

    initUIMgr() {
        // 父类实现
    }

    start() {
        this.entity.start();
        if (this.scene) {
            this.scene.start();
        }
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

    onDestroy() {
        if (this.uiMgr != undefined) {
            this.uiMgr.onDestroy();
            this.uiMgr = undefined;
        }
        if (this.entity) {
            this.entity.onDestroy();
            this.entity = undefined;
        }
        if (this.scene) {
            this.scene.onDestroy();
        }

        let eventMgr: EventManager = Global.eventMgr;
        for (const key in this.eventDict) {
            let info: object = this.eventDict[key];
            eventMgr.removeListener(key, info[0], info[1]);
        }
        this.eventDict = {};
    }
}
