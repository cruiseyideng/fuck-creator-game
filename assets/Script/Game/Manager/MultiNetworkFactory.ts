import NetworkManager from "./NetworkManager";
import { EnumNetworkName } from "../../Core/Enum/EnumNetwork";
import { EnumEvents } from "../Enum/EnumEvents";
import MultiNetworkManager from "./MultiNetworkManager";
import Logger from "../../Utils/Logger";

// 多条网络连接工厂

export default class MultiNetworkFactory {

    private _networks: Object = {};

    init() {
    }

    /**
     * 如果不存在，创建一个返回
     * 如果已经存在，直接返回
     * @param name 
     */
    createOrGetMgr(name: EnumNetworkName) {
        if (name == EnumNetworkName.Default) {
            Logger.error("create network mgr failed with Default");
            return;
        }
        if (this._networks.hasOwnProperty(name)) {
            return this._networks[name];
        }
        let mgr = new MultiNetworkManager(name);
        mgr.init();
        this._networks[name] = mgr;
        return mgr;
    }

    getMgr(name: EnumNetworkName) {
        if (this._networks.hasOwnProperty(name)) {
            return this._networks[name];
        }
        return undefined;
    }

    destroyMgr(name: EnumNetworkName) {
        let mgr: MultiNetworkManager = this.getMgr(name);
        if (mgr) {
            mgr.closeConnect();
            delete this._networks[name];
        }
    }

    onDestroy() {
        for (var networkName in this._networks) {
            let networkMgr = this._networks[networkName];
            networkMgr.closeConnect();
        }
        this._networks = {};
    }

}