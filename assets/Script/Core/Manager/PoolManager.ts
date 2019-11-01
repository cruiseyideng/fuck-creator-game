import Logger from "../../Utils/Logger";

// 缓存池
export default class PoolManager {

    private _poolInfo: Object = {};
    private _poolCacheObjs: Object = {};

    init() {

    }

    /**
     * 通用接口，添加缓存池
     * @param name 缓存池名称
     * @param borrow_func 创建函数
     * @param release_func 释放函数
     * @param size 尺寸
     */
    addPool(name: string, borrow_func: Function, release_func: Function, size = 100) {
        let pool: Object = this.getPool(name);
        if (pool) {
            Logger.warn("pool already exists!", name);
            return;
        }
        this._poolInfo[name] = { "name": name, "borrow": borrow_func, "release": release_func, "size": size };
    }

    /**
     * 添加节点缓存池
     * @param name 缓存池名称
     * @param nodeObj 节点对象，可以是cc.Node和cc.Prefab的任何继承类
     * @param borrow_func 创建函数
     * @param release_func 释放函数
     * @param size 
     */
    addNodePool(name: string, nodeObj: cc.Prefab | cc.Node, borrow_func: Function, release_func: Function, size = 100) {
        let new_borrow_func = function () {
            let obj = cc.instantiate(nodeObj);
            if (borrow_func) {
                obj = borrow_func(obj);
            }
            return obj;
        };
        this.addPool(name, new_borrow_func, release_func, size);
    }

    removePool(name: string) {
        let pool: Object = this.getPool(name);
        if (pool) {
            delete this._poolInfo[name];
        }
        if (this._poolCacheObjs.hasOwnProperty[name]) {
            delete this._poolCacheObjs[name];
        }
    }

    getPool(name: string) {
        if (this._poolInfo.hasOwnProperty(name)) {
            return this._poolInfo[name];
        }
        return undefined;
    }

    borrow(poolName: string, ...params) {
        let pool = this.getPool(poolName);
        if (pool) {
            let cacheObj = this._popPoolCacheObj(poolName);
            if (cacheObj) {
                return cacheObj;
            }
            let borrow = pool["borrow"];
            let obj = borrow(...params);
            return obj;
        } else {
            Logger.error("borrow obj but no pool is found:", poolName);
            return undefined;
        }
    }

    release(poolName: string, obj: Object) {
        let pool = this.getPool(poolName);
        if (pool) {
            let release = pool["release"];
            release(obj);
            this._pushPoolCacheObj(poolName, obj, pool['size']);
        } else {
            Logger.error("release obj but no pool is found:", poolName);
        }
    }

    private _popPoolCacheObj(poolName) {
        if (this._poolCacheObjs.hasOwnProperty(poolName)) {
            let cache_list = this._poolCacheObjs[poolName];
            if (cache_list && cache_list.length > 0) {
                return cache_list.shift();
            }
        }
        return undefined;
    }

    private _pushPoolCacheObj(poolName, obj, size) {
        let cache_list = this._poolCacheObjs[poolName];
        if (!cache_list) {
            cache_list = [];
            this._poolCacheObjs[poolName] = cache_list;
        }
        if (cache_list.length >= size) {
            Logger.warn("push pool cache but size is excceed!", poolName, size);
            return;
        }
        cache_list.push(obj);
    }

    report() {
        Logger.info("-------------- pool cache report -----------");
        for (var poolName in this._poolCacheObjs) {
            let cache_list = this._poolCacheObjs[poolName];
            Logger.info("Pool:", poolName, " Length:", cache_list.length);
        }
        Logger.info("--------------------------------------------");
    }

    onDestory() {
        this._poolInfo = {};
        this._poolCacheObjs = {};
    }

}