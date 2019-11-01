/**
 * 加载管理器
 * 1. 支持缓存
 */

import Global from "../Global";
import LoadResInfo, { BatchLoadResInfo } from "../DataStruct/LoadResInfo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoaderManager {

    cacheMap: Object = {};      // 缓存表
    batchLoadInfoList: BatchLoadResInfo[] = [];       // 批量加载列表

    /** 
     * 场景切換 
     * */
    sceneSwitch(sceneName: string, assetsList: string[], callback: Function = null, showLoading = true) {
        if(showLoading){
            Global.gUIMgr.showUI("loading");
        }
        Global.gUIMgr.setPersistRoot(true);

        let _loadAssets = ()=>{
            this.loadResArray(assetsList, undefined, _loadScene.bind(this))
        }

        let _loadAssetsComplete = () => {
            if (callback) {
                callback();
            }
        }

        let _loadScene = () => {
            if(sceneName && sceneName != ""){
                cc.director.loadScene(sceneName, (error) => {
                    Global.gUIMgr.setPersistRoot(false);
                    if(showLoading){
                        Global.gUIMgr.hideUI("loading");
                    }
                    _loadAssetsComplete();
                });
            }else{
                if(showLoading){
                    Global.gUIMgr.hideUI("loading");
                }
                _loadAssetsComplete();
            }
        }

        _loadAssets();
    }

    // 批量加载，带进度条
    loadResArray(urlList: string[], progressCallback, completeCallback, addToCache = false){
        let _complete = (error: Error, resource: any[]) => {
            if(addToCache){
                for (let index = 0; index < urlList.length; index++) {
                    let url: string = urlList[index];
                    this.addCacheObject(url, resource[index]);
                }
            }
            if (completeCallback){
                completeCallback(error, resource);
            }
        }
        cc.loader.loadResArray(urlList, progressCallback, _complete);
    }

    /**
     * 批量加载
     * @param url 
     * @param callback 参数列表：BatchLoadResInfo
     * @param addToCache 
     */
    batchLoadRes(urlList: string[], callback: Function = null, addToCache: Boolean = false) {
        let info: BatchLoadResInfo = new BatchLoadResInfo(urlList, callback);
        // 用loadInfoMap去重复
        // TODO: loadres可以换成loadResArray
        for (const key in info.loadInfoMap) {
            let loadInfo: LoadResInfo = info.loadInfoMap[key];
            this.loadRes(loadInfo.url, (error: Error, result: Object) => {
                if (error != null) {
                    info.onLoadError(loadInfo.url, error);
                } else {
                    info.onLoadSuccess(loadInfo.url, result);
                }
            }, addToCache);
        }
    }

    /** 
     * 资源加载 
     * @param url string 本地资源路径
     * @param callback Function 参数列表：Error, Object
     * @param addToCache boolean 是否缓存
     * @returns
     * Error
     * Object
     * */
    loadRes(url: string, callback: Function = null, addToCache: Boolean = false) {
        if (this.hasCacheObject(url)) {
            if (callback) {
                callback(undefined, this.getCacheObject(url));
            }
            return;
        }

        return new Promise(resolve => {
            cc.loader.loadRes(url, function (error, result) {
                if (!error && addToCache) {
                    this.addCacheObject(url, result);
                }
                if (callback) {
                    callback(error, result);
                }
                resolve();
            }.bind(this));
        });
    }
    // /**同步加载资源方式，用于一些后续计算需要依赖加载完成的资源(由于会有阻塞,慎用！)*/
    // async syncLoadRes(url: string, callback: Function = null, addToCache: Boolean = false) {
    //     if (this.hasCacheObject(url)) {
    //         if (callback) {
    //             callback(undefined, this.getCacheObject(url));
    //         }
    //         return;
    //     }
    //     let promise = new Promise((resolve: (resultObj:{err:any, res:any})=>void, reject)=>{
    //         cc.loader.loadRes(url, (error, result) =>{
    //             resolve({err: error, res: result});
    //         });
    //     });
    //     let {err, res} = await promise;
    //     if (!err && addToCache)
    //         this.addCacheObject(url, res);
    //     if (callback)
    //         callback(err, res);
    // }

    /**
     * 加载图集
     * @param url 
     * @param callback 
     */
    loadAtlas(url: string, callback: Function = null, addToCache: Boolean = false) {
        let atlas = this.getCacheObject(url);
        if(atlas){
            if(callback){
                callback(undefined, atlas);
            }
            return;
        }
        cc.loader.loadRes(url, cc.SpriteAtlas, (err, atlas) => {
            if(addToCache){
                this.addCacheObject(url, atlas);
            }
            if (callback) {
                callback(err, atlas);
            }
        });
    }

    /** 场景预加载 */
    preLoadScene(url: string, callback: Function = null) {
        cc.director.preloadScene(url, function () {
            if (callback) {
                callback();
            }
        });
    }

    /******************************************
     *              缓存API
     ******************************************/
    getCacheObject(url: string): Object {
        return this.cacheMap[url];
    }

    addCacheObject(url: string, object: Object) {
        this.cacheMap[url] = object;
    }

    removeCacheObject(url: string) {
        if (this.cacheMap.hasOwnProperty(url)) {
            this.cacheMap[url] = undefined;
        }
    }

    hasCacheObject(url: string): Object {
        return this.cacheMap.hasOwnProperty(url);
    }
}
