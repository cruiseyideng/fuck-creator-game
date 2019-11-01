import { EnumGameKind } from "../Enum/EnumGame";
import AssetsUpdater from "./AssetsUpdater";
import AssetsVersionConst from "../Const/AssetsVersionConst";
import Global from "../Global";

/**
 * 资源版本管理器
 */

 export default class AssetsVersionManager {

    updaterList: AssetsUpdater[] = [];      // 资源更新
    gameVersion: Object = {};               // 游戏版本号

    init() {
        this.createUpdaters();
    }

    createUpdaters() {
        if (!Global.config.canAssetUpdate){
            return;
        }
        let updateGameList: EnumGameKind[] = AssetsVersionConst.updateGameList;
        for (const iterator of updateGameList) {
            this.updaterList.push(new AssetsUpdater(iterator));
        }
    }

    getUpdater(gameKind: EnumGameKind): AssetsUpdater {
        for (const iterator of this.updaterList) {
            if(iterator.gameKind == gameKind) {
                return iterator;
            }
        }
        return undefined;
    }

    destroyUpdaters() {
        if (!Global.config.canAssetUpdate){
            return;
        }
        for (const iterator of this.updaterList) {
            iterator.onDestroy();
        }
        this.updaterList = [];
    }
    
    setVersion(gameKind: EnumGameKind, version: string) {
        this.gameVersion[gameKind] = version;
    }

    getVersion(gameKind: EnumGameKind): string {
        if (!this.gameVersion.hasOwnProperty(gameKind)) {
            return AssetsVersionConst.DEFAULT_VERSION;
        }
        return this.gameVersion[gameKind];
    }
 }