import Global from "./Global";
import InitGlobal from "./InitGlobal";
import Logger from "../Utils/Logger";
import { BatchLoadResInfo } from "./DataStruct/LoadResInfo";
import LocalStorage from "../Utils/LocalStorage";
import { EnumLocalStorageKey } from "./Enum/EnumLocalStorageKey";
import AdapterHelper from "../Utils/AdapterHelper";

const { ccclass, property } = cc._decorator;

// 不要随意修改这份文件！！！！

@ccclass
export default class Driver extends cc.Component {

    private _initGlobal: any;

    statusLabel: cc.Label;
    onLoad() {
        Logger.error("Init Driver");
        AdapterHelper.fixApdater();
        this._initGlobal = this.overrideInitGlobal();
        this.initGlobal();
    }

    overrideInitGlobal(){
        return InitGlobal;
    }

    initGlobal() {
        if (CC_DEBUG) {
            window['Global'] = Global;
        }
        this._initGlobal.create();
        this.statusLabel = cc.find("Canvas").getChildByName("statusLabel").getComponent(cc.Label);
        this._initGlobal.loadPrerequisite(this.checkPrerequisite.bind(this));
        cc.game.addPersistRootNode(cc.find("PersistRoot"));
    }

    checkPrerequisite(loadResInfo: BatchLoadResInfo) {
        if (!loadResInfo.isSuccess()) {
            this.statusLabel.string = "初始化失败";
            // Add custom scripts below
            return;
        } else {
            this.statusLabel.string = "初始化成功";
        }
        this.init();
    }

    init() {
        this._initGlobal.init(this.startGlobal.bind(this));
    }

    startGlobal(){
        this._initGlobal.startGame();
    }

    // 如果有需要可以测试期间，删除localstorage
    testClearLocalStorge() {
        for (const key in EnumLocalStorageKey) {
            Logger.warn("clear local storage:" + EnumLocalStorageKey[key]);
            LocalStorage.removeItem(EnumLocalStorageKey[key]);
        }
    }
}
