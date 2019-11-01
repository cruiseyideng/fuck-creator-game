/**
 * 初始化Global
 * 程序入口
 */

import GlobalUIManager from "./Manager/GlobalUIManager";
import WorldManager from "../Core/Manager/WorldManager";
import LoaderManager from "./Manager/LoaderManager";
import PartFactory from "../Core/PartFactory";
import PartManager from "./Manager/PartManager";
import Global from "./Global";
import AtlasManager from "./Manager/AtlasManager";
import GlobalConfig from "./Config/GlobalConfig";
import PathConfig from "./Config/PathConfig";
import NetworkConfig from "./Config/NetworkConfig";
import AudioManager from "./Manager/AudioManager";
import AssetsVersionManager from "./AssetManager/AssetsVersionManager";
import i18n from "./Utils/I18n";
import NetworkManager from "./Manager/NetworkManager";
import TimerManager from "./Manager/TimerManager";
import ErrorCodeManager from "./ErrorCode/ErrorCodeManager";
import SceneManager from "../Core/Manager/SceneManager";
import Base64Helper from "../Utils/Base64Helper";
import EventManager from "../Core/Manager/EventManager";
import EntityManager from "./Manager/EntityManager";
import WorldConst from "./Const/WorldConst";
import MultiNetworkFactory from "./Manager/MultiNetworkFactory";
import PoolManager from "../Core/Manager/PoolManager";
import NativePersistence from "../Utils/NativePersistence";
import NativeBridge from "../Utils/NativeBridge";
import PlatformManager from "./Manager/PlatformManager";


export default class InitGlobal {

    static initCallback = undefined;

    static create() {
        Global.config = new GlobalConfig();
        Global.pathConfig = new PathConfig();
        Global.networkConfig = new NetworkConfig();

        Global.nativePersistence = new NativePersistence();
        Global.worldMgr = new WorldManager();
        Global.sceneMgr = new SceneManager();
        Global.loaderMgr = new LoaderManager();
        Global.partFactory = new PartFactory();
        Global.partManager = new PartManager();
        Global.entityManager = new EntityManager();
        Global.poolMgr = new PoolManager();
        Global.gUIMgr = new GlobalUIManager();
        Global.atlasMgr = new AtlasManager();
        Global.audioMgr = new AudioManager();
        Global.eventMgr = EventManager.instance;
        Global.assetsVersionMgr = new AssetsVersionManager();
        Global.networkMgr = new NetworkManager();
        Global.multiNetFactory = new MultiNetworkFactory();
        Global.timerMgr = new TimerManager();
        Global.errorCodeMgr = new ErrorCodeManager();
        Global.i18n = new i18n();
        Global.platformMgr = new PlatformManager();
    }

    /**
     * 加载先决条件
     * 1. 异步读取本地资源
     */
    static loadPrerequisite(callback: Function) {
        Global.loaderMgr.batchLoadRes(Global.pathConfig.launchPrerequisiteFiles, callback, true);
    }

    static init(callback) {
        this.initCallback = callback;

        Base64Helper.init();
        NativeBridge.init();

        Global.i18n.init();
        Global.errorCodeMgr.init();
        Global.config.init();
        Global.pathConfig.init();
        Global.networkConfig.init();
        Global.gUIMgr.init();
        Global.nativePersistence.init();

        Global.partManager.init();
        Global.entityManager.init();
        Global.poolMgr.init();
        Global.atlasMgr.init();
        Global.audioMgr.init();
        Global.assetsVersionMgr.init();
        Global.networkMgr.init();
        Global.multiNetFactory.init();
        Global.timerMgr.init();
        Global.worldMgr.init();

        Global.platformMgr.init(this.onInit.bind(this));
    }

    static onInit(){
        this.initCallback();
    }

    static startGame() {
        // startGame
        Global.worldMgr.switchWorld(WorldConst.Launch);
    }

    static test() {
        // write test logic
    }

}