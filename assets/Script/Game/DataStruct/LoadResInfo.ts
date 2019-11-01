import Logger from "../../Utils/Logger";

/**
 * 加载资源数据
 */
export default class LoadResInfo {
    url: string = "";
    loaded: boolean = false;
    success: boolean = false;
    result: Object;
    error: Error;

    constructor(url: string) {
        this.url = url;
    }
}

/**
 * 批量加载资源
 * 1. 去重复
 */
export class BatchLoadResInfo {
    loadInfoMap: Object = {};
    totalCount: number = 0;

    completeCallback: Function;

    constructor(urlList: string[], completeCallback: Function = undefined) {
        if (urlList.length == 0) {
            if (completeCallback) {
                completeCallback(this);
            }
            return;
        }
        for (const url of urlList) {
            let info = new LoadResInfo(url);
            this.loadInfoMap[url] = info;
        }
        // TODO: 计算Map长度
        this.totalCount = Object.keys(this.loadInfoMap).length;
        this.completeCallback = completeCallback;
    }

    onLoadSuccess(url: string, result: Object) {
        let info: LoadResInfo = this.loadInfoMap[url];
        if (info) {
            info.success = true;
            info.loaded = true;
            info.result = result;
            if (this.isLoadComplete()) {
                this.doCompleteCallback();
            }
        }
    }

    onLoadError(url: string, error: Error) {
        Logger.log("onLoadError", url);
        let info: LoadResInfo = this.loadInfoMap[url];
        if (info) {
            info.success = false;
            info.loaded = true;
            info.error = error;
            if (this.isLoadComplete()) {
                this.doCompleteCallback();
            }
        }
    }

    doCompleteCallback() {
        if (this.completeCallback) {
            this.completeCallback(this);
        }
    }
    
    isLoadComplete() {
        let loadedCount = 0;
        for (const key in this.loadInfoMap) {
            let info = this.loadInfoMap[key];
            if (info.loaded) {
                loadedCount = loadedCount + 1;
            }
        }
        return this.totalCount == loadedCount;
    }

    isSuccess() {
        let successCount = 0;
        for (const key in this.loadInfoMap) {
            let info = this.loadInfoMap[key];
            if (info.success) {
                successCount = successCount + 1;
            }
        }
        return this.totalCount == successCount;
    }

}