/**
 * 全局引用类
 */

import GlobalUIManager from "./Manager/GlobalUIManager";
import WorldManager from "../Core/Manager/WorldManager";
import World from "../Core/World";
import UIManager from "../Core/Manager/UIManager";
import LoaderManager from "./Manager/LoaderManager";
import PartFactory from "../Core/PartFactory";
import PartManager from "./Manager/PartManager";
import AtlasManager from "./Manager/AtlasManager";
import GlobalConfig from "./Config/GlobalConfig";
import PathConfig from "./Config/PathConfig";
import NetworkConfig from "./Config/NetworkConfig";
import AudioManager from "./Manager/AudioManager";
import AssetsVersionManager from "./AssetManager/AssetsVersionManager";
import NetworkManager from "./Manager/NetworkManager";
import TimerManager from "./Manager/TimerManager";
import ErrorCodeManager from "./ErrorCode/ErrorCodeManager";
import SceneManager from "../Core/Manager/SceneManager";
import i18n from "./Utils/i18n";
import EntityManager from "./Manager/EntityManager";
import ServerConfig from "./Config/ServerConfig";
import EventManager from "../Core/Manager/EventManager";
import MultiNetworkFactory from "./Manager/MultiNetworkFactory";
import PoolManager from "../Core/Manager/PoolManager";
import NativePersistence from "../Utils/NativePersistence";
import PlatformManager from "./Manager/PlatformManager";

export default class Global {
    public static nativePersistence: NativePersistence; // native持久化
    public static worldMgr: WorldManager;    // World管理器
    public static sceneMgr: SceneManager;    // 场景管理器
    public static config: GlobalConfig;      // 全局配置
    public static pathConfig: PathConfig;    // 全局路径配置
    public static networkConfig: NetworkConfig;// 网络配置
    public static serverConfig: ServerConfig;// 服务器配置

    public static gUIMgr: GlobalUIManager;   // 全局UI管理器
    public static eventMgr: EventManager;    // 事件管理器
    public static audioMgr: AudioManager;   // 音乐管理器
    public static loaderMgr: LoaderManager;  // 加载管理器
    public static partFactory: PartFactory;  // 部件工厂
    public static entityManager: EntityManager; // 实体管理器
    public static partManager: PartManager;  // 部件管理器
    public static atlasMgr: AtlasManager;   // 公用图集管理器
    public static assetsVersionMgr: AssetsVersionManager; // 资源版本管理器
    public static networkMgr: NetworkManager;      // 网络管理
    public static multiNetFactory: MultiNetworkFactory;  // 多条连接创建工厂
    public static timerMgr: TimerManager;    // 全局时间管理器
    public static errorCodeMgr: ErrorCodeManager;   // 异常编码管理
    public static i18n: i18n;                // 多语言管理
    public static poolMgr: PoolManager;     // 缓存池管理器
    public static platformMgr: PlatformManager; // 平台管理器

    // -------以下变量可能为undefined -------
    public static world: World;              // 当前所在World
    public static uiMgr: UIManager;          // 当前所在场景UI
}
