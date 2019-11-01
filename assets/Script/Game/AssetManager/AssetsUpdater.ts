import Global from "../Global";
import AssetsVersionConst from "../Const/AssetsVersionConst";
import AssetsManifestUtil from "../Utils/AssetsManifestUtil";
import { EnumAssetsEvents } from "../Enum/EnumAssetsEvents";
import Logger from "../../Utils/Logger";
import { EnumAssetsUpdateState } from "../Enum/EnumAssetsUpdateState";
import MathEX from "../../Utils/MathEX";
import LocalStorage from "../../Utils/LocalStorage";
import { EnumLocalStorageKey } from "../Enum/EnumLocalStorageKey";

/**
 * 资源更新器
 */

export default class AssetsUpdater {

    gameKind: string;     // 游戏类型
    storagePath: string;

    // 更新相关
    totalBytes: number = 0;         // 总的大小
    downloadedBytes: number = 0;    // 已经下载成功的大小
    errorUpdatingTimes: number = 0;  // 单文件更新失败次数
    updateFailedTimes: number = 0;   //  更新失败次数

    _assetsManager: any;
    _checkListener: any;

    _inited: boolean = false;

    open_log = true;    // 开启本地log

    constructor(gameKind: string) {
        this.gameKind = gameKind;
        let remoteDir: string = AssetsVersionConst.remoteAssetDirName.replace("{ASSETS_DIR}", this.gameKind);
        this.storagePath = Global.pathConfig.getPathRelativeWritablePath(remoteDir);
        this._assetsManager = new jsb.AssetsManager("", this.storagePath, AssetsManifestUtil.versionCompareHandle);
        this._assetsManager.setMaxConcurrentTask(AssetsVersionConst.maxConcurrentTask);
        this._checkListener = new jsb.EventListenerAssetsManager(this._assetsManager, this._onEventCallback.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);
        this._assetsManager.setVerifyCallback(this._onVerifyCallback.bind(this));
        this.init();
    }

    private localLog(...params){
        if(this.open_log){
            Logger.log(...params);
        }
    }

    init() {
        this._inited = true;
        this.loadManifestFromServer();
    }

    loadManifestFromServer() {
        AssetsManifestUtil.rewriteProjectManifestFromServer(this.gameKind);
        let obj: Object = AssetsManifestUtil.getRawProjectManifestJson(this.gameKind);
        AssetsManifestUtil.updateManifestJsonUrlFromServer(obj, this.gameKind);
        let manifestStr: string = JSON.stringify(obj);

        console.error("manifestStr", this.gameKind, manifestStr)
        let manifest = new jsb.Manifest(manifestStr, this.storagePath);
        this._assetsManager.loadLocalManifest(manifest, "");
        // 返回缓存中的manifest，当缓存中存在manifest，并且版本号大于等于原始manifest时
        // 否则返回原始的manifest
        manifest = this._assetsManager.getLocalManifest();
        let version: string = manifest.getVersion();
        Global.assetsVersionMgr.setVersion(this.gameKind, version);
        Global.eventMgr.dispatchEvent(EnumAssetsEvents.UPDATE_GAME_VERSION, this, version);
    }

    checkUpdate() {
        Global.eventMgr.dispatchEvent(EnumAssetsEvents.CHECK_UPDATE, this);
        this._assetsManager.checkUpdate();
    }

    startUpdate() {
        this._assetsManager.update();
        this.downloadedBytes = 0;
        this.totalBytes = this._assetsManager.getTotalBytes();
        Global.eventMgr.dispatchEvent(EnumAssetsEvents.START_UPDATE, this);
    }

    downloadFailedAssets() {
        this.downloadedBytes = this.downloadedBytes + this._assetsManager.getDownloadedBytes();
        this._assetsManager.downloadFailedAssets();
    }

    getState() {
        return this._assetsManager.getState();
    }

    _onEventCallback(event) {
        let eventCode: string = event.getEventCode();
        // console.error("_onEventCallback", eventCode);
        switch (eventCode) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.onInitError(eventCode);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.localLog("UPDATE", this.gameKind, "ALREADY_UP_TO_DATE");
                this.alreadyUpToDate(event);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.newVersionFound(event);
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.updateProgress(event);
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.updateSucceed(event);
                this.localLog("UPDATE", this.gameKind, "UPDATE_FINISHED");
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.localLog("UPDATE", this.gameKind, "ERROR_UPDATING", event.getAssetId());
                this.errorUpdating(event);
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.localLog("UPDATE", this.gameKind, "UPDATE_FAILED");
                this.updateFailed(event);
                break;
            case jsb.EventAssetsManager.ASSET_UPDATED:
                this.localLog("UPDATE", this.gameKind, "ASSET_UPDATED", event.getAssetId(), event.getDownloadedBytes(), event.getPercent());
                break;
            default:
                return;
        }
    }

    onInitError(eventCode: string) {
        Global.eventMgr.dispatchEvent(EnumAssetsEvents.UPDATE_INIT_ERROR, eventCode);
    }

    newVersionFound(event) {
        let localManifest: any = this._assetsManager.getLocalManifest();
        let remoteManifest: any = this._assetsManager.getRemoteManifest();
        let localVersion: string = localManifest.getVersion();
        let remoteVersion: string = remoteManifest.getVersion();
        this.localLog("UPDATE", this.gameKind, "NEW_VERSION_FOUND", localVersion, remoteVersion);
        Global.eventMgr.dispatchEvent(EnumAssetsEvents.NEW_VERSION_FOUND, this, event, localVersion, remoteVersion);
    }

    alreadyUpToDate(event) {
        Global.eventMgr.dispatchEvent(EnumAssetsEvents.ALREADY_UP_TO_DATE, this, event);
    }

    updateProgress(event) {
        /**
         * 引擎bug说明：
         * onProgress里面只有第二次产生进度才会累计downloaded
         */
        let totalBytes: number = this.getTotalBytes();
        let downloadedBytes: number = this.getDownloadedBytes();
        this.localLog("UPDATE", this.gameKind, "UPDATE_PROGRESSION", event.getAssetId(), downloadedBytes, totalBytes);
        Global.eventMgr.dispatchEvent(EnumAssetsEvents.UPDATE_PROGRESSION, this, event, downloadedBytes, totalBytes);
    }

    /**
     * return 0-1的小数
     */
    getPercent(){
        let state = this.getState();
        if(state == EnumAssetsUpdateState.UP_TO_DATE){
            return 1;
        }
        let totalBytes: number = this.getTotalBytes();
        let downloadedBytes: number = this.getDownloadedBytes();
        if(downloadedBytes == 0 || Math.abs(totalBytes - downloadedBytes) <= MathEX.FLOAT_EPSILON){
            return 0;
        }
        return downloadedBytes / totalBytes;
    }

    errorUpdating(event) {
        this.errorUpdatingTimes = this.errorUpdatingTimes + 1;
    }

    updateFailed(event) {
        this.updateFailedTimes = this.updateFailedTimes + 1;
        // if (this.updateFailedTimes > AssetsVersionConst.failedUpdateAlertTimes) {
        //     Global.gUIMgr.showDialogTip(Global.i18n.translate("update.failedupdate"), DialogTipView.TYPE_SURE, () => {
        //         this.downloadFailedAssets();
        //     });
        // }
    }

    updateSucceed(event) {
        // 初始化后的 AssetsManager 的 local manifest 就是缓存目录中的 manifest
        var hotUpdateSearchPaths = this._assetsManager.getLocalManifest().getSearchPaths();
        // 默认的搜索路径
        var searchPaths = jsb.fileUtils.getSearchPaths();

        // hotUpdateSearchPaths 会前置在 searchPaths 数组的开头
        Array.prototype.unshift.apply(searchPaths, hotUpdateSearchPaths);

        jsb.fileUtils.setSearchPaths(searchPaths);

        LocalStorage.setString(EnumLocalStorageKey.FILEUTILS_SEARCH_PATHS, JSON.stringify(searchPaths));

        let totalBytes: number = this.getTotalBytes();
        Global.eventMgr.dispatchEvent(EnumAssetsEvents.UPDATE_PROGRESSION, this, event, totalBytes, totalBytes);
        Global.eventMgr.dispatchEvent(EnumAssetsEvents.UPDATE_FINISHED, this);
    }

    _onVerifyCallback(filePath, asset) {
        // let data = Md5Helper.getDataFromFileEncrypted(filePath);
        let data = jsb.fileUtils.getDataFromFile(filePath);
        if (asset.size != data.length) {
            Logger.warn(this, filePath + "Size Verify Failed 1 !! size:" + data.length +
                " config size：" + asset.size);
            return false;
        }
        // let encrypted_md5 = cryptoMd5(data);
        // if (encrypted_md5 != asset.md5) {
        //     AssetsLogCollect.logVarifyFailed(this, filePath + "Md5 Verify Failed 2 !! size:" + data.length +
        //         " config size：" + asset.size + " md5:" + encrypted_md5 + " config md5:" + asset.md5);
        //     return false;
        // }
        return true;
    }

    getDownloadedBytes() {
        return this.downloadedBytes + this._assetsManager.getDownloadedBytes();
    }

    getTotalBytes() {
        // 开始加载才会计算size
        if (this.totalBytes == 0) {
            this.totalBytes = this._assetsManager.getTotalBytes();
        }
        return this.totalBytes;
    }

    onDestroy() {
        this._inited = false;
        this._assetsManager = undefined;
    }

}