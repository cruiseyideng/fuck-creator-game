/**
 * HttpRequest核心模块
 */

export default class HttpRequestCore {
 
    private url: string = "";
    private methodType: string = "GET";
    private responseType: XMLHttpRequestResponseType = "json";
    private xhr: XMLHttpRequest;
    private params: string = null;
    // 重试次数
    private retryTimes: number = 0;
    // 已经重试次数
    private retriedTimes: number = 0;
    // 是否在重试中
    private _isRetring: boolean = false;
    // 重试回调函数
    private _retryCallback: Function;

    public setMethod(method: string = "GET") {
        this.methodType = method;
    }

    public createParams(paramsObj: object): string {
        let resParams = "";
        let nowIndex = 1;
        for (const key in paramsObj) {
            if (paramsObj.hasOwnProperty(key)) {
                if (nowIndex == 1) {
                    resParams += key + "=" + paramsObj[key];
                }
                else {
                    resParams += "&" + key + "=" + paramsObj[key];
                }
                nowIndex += 1;
            }
        }
        this.params = resParams;
        return resParams;
    }

    public setRetryTimes(times: number) {
        this.retryTimes = times;
    }

    private resetRetry() {
        this.retriedTimes = 0;
        this._isRetring = false;
    }

    public isRetring(): boolean {
        return this._isRetring;
    }

    public setRetryCallback(callback: Function) {
        this._retryCallback = callback;
    }

    public setResponseType(responseType: XMLHttpRequestResponseType) {
        this.responseType = responseType;
    }

    setUrl(url: string) {
        this.url = url;
    }

    public setContentType() {
    }
    
    public send(callback: Function, params: any = null, timeOut: number = 15000) {
        this.retrySend(callback, params, timeOut);
    }

    private retrySend(callback: Function, params: any = null, timeOut: number = 15000) {
        this.internalSend((isOk: boolean, response) => {
            if (!isOk && this.retryTimes > 0 && this.retriedTimes < this.retryTimes) {
                this.retriedTimes = this.retriedTimes + 1;
                this._isRetring = true;
                if (this._retryCallback) {
                    this._retryCallback()
                }
                this.retrySend(callback, params, timeOut);
            } else {
                if (callback) {
                    callback(isOk, response);
                }
            }
        }, params, timeOut);
    }

    private internalSend(callback: Function, params: any = null, timeOut: number = 15000) {
        this.resetRetry();
        let url: string = this.url;
        if (params && this.methodType == "GET") {
            let getParams: string = this.createParams(params);
            getParams = encodeURI(getParams);
            url += "?" + getParams;
        } else {
            this.params = null;
        }
        this.xhr = cc.loader.getXMLHttpRequest();
        let xhr: XMLHttpRequest = this.xhr;
        xhr.responseType = this.responseType;
        xhr.timeout = timeOut;
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let response = xhr.response;
                if (callback) {
                    callback(true, response);
                }
            } else if (xhr.readyState == 4 && xhr.status == 301) {
                this.setUrl(xhr.getResponseHeader("Location"));
                this.send(callback, params, timeOut);
            }
            else if (xhr.readyState == 4 && xhr.status == 404) {
                if (callback) {
                    callback(false);
                }
            }
            else {
                if (xhr.readyState == 4) {
                    if (callback) {
                        callback(false);
                    }
                }
            }
        };
        xhr.onprogress = () => {
        }
        xhr.onerror = () => {
            if (callback) {
                callback(false);
            }
        }
        xhr.ontimeout = () => {
            if (callback) {
                callback(false);
            }
        }
        xhr.open(this.methodType, url, true);
        if (params && this.methodType == "GET") {
            params = null;
        }
        xhr.send(params);
    }

    onDestroy(){
        this.xhr.abort();
        this.xhr = null;
        this._retryCallback = null;
    }
}