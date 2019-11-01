import Logger from "./Logger";
import Md5Helper from "./Md5Helper";
import DateUtil from "./DateUtil";
import { getBaseName } from "./funlib";
import Uint8ArrayDd5 = require("./Uint8ArrayDd5");
import Global from "../Game/Global";
import LocalStorage from "./LocalStorage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NativeBridge {

    private static checkSelfPermissionCallback = undefined;

    public static init() {
        if (cc.sys.isNative) {
            window["NativeBridge"] = NativeBridge;
        }
    }

    public static showJsError(errorMsg: string) {
        console.log("showJsError=", errorMsg);
    }

    //获取安卓母包渠道号
    public static openAndroidRawPackChannel() {
        if (cc.sys.isNative) {
            Logger.log("openAndroidRawPackChanel");
            let channelId = 1;
            if (cc.sys.os == cc.sys.OS_IOS) {
                return channelId;
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                let channelIdStr: string = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getChannel", "()Ljava/lang/String;");
                Logger.log("获取安卓母包渠道=-=-=-=0000->>>>>id:", channelIdStr);
                channelId = parseInt(channelIdStr);
                if (isNaN(channelId)) {
                    channelId = 1;
                }
                if (channelId < 1) {
                    channelId = 1;
                }
                Logger.log("获取安卓母包渠道=-=-=-=1111->>>>>", channelId);
                return channelId;
            }
        }
    }

    //打开并保存相片
    static openAlbumTimeOutId = 0;
    static openAlbumTImeOutTime = 500;//防止上传图片失败或者打开相册就直接取消了菊花不消失
    public static openAlbumToWriteWithWritePath(photoName: string, rotationDegree: number = 0) {
        if (cc.sys.isNative) {
            Global.gUIMgr.showPrepareMask();
            let photoPath: string = Config.Local_Image_Foler;
            let callRes;
            if (!jsb.fileUtils.isDirectoryExist(photoPath)) {
                jsb.fileUtils.createDirectory(photoPath);
            }
            photoPath = photoPath + photoName;
            if (cc.sys.os == cc.sys.OS_IOS) {
                callRes = jsb.reflection.callStaticMethod("NativeOcClass", "openAlbumToWriteWithWritePath:rotationDegree:", photoPath, rotationDegree);
                if (callRes) {
                    //  Global.gUIMgr.showPrepareMask();
                } else {
                    Global.gUIMgr.showPopTip("当前版本不支持该功能哦~快去下载新版吧~");
                }
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openPhoto", "()V");
                callRes = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openAlbumToWriteWithWritePath", "(Ljava/lang/String;I)I", photoPath, rotationDegree);
                if (callRes) {
                    //  Global.gUIMgr.showPrepareMask();
                } else {
                    Global.gUIMgr.showPopTip("当前版本不支持该功能哦~快去下载新版吧~");
                }
            }
        }

        this.openAlbumTimeOutId = setTimeout(() => {
            Global.gUIMgr.hideUI("prepareMask");
        }, this.openAlbumTImeOutTime);
    }

    public static saveLocalPhoto(photoName: string, data: any) {
        if (cc.sys.isNative) {
            // let photoPath: string = jsb.fileUtils.getWritablePath() + "photo";
            let photoPath: string = Config.Local_Image_Foler.substr(0, Config.Local_Image_Foler.length - 1);
            // Logger.log("openAlbumToWriteWithWritePath===", photoPath);
            if (!jsb.fileUtils.isDirectoryExist(photoPath)) {
                jsb.fileUtils.createDirectory(photoPath);
            }
            // photoPath = Config.Local_Image_Foler + photoName;
            // Logger.log("saveLocalPhoto========", photoPath);
            jsb.fileUtils.writeDataToFile(data, photoName);
        }
    }

    //结算保存相片
    public static finishWriteAlbum(photoPath: string) {
        // Global.gUIMgr.hideUI("prepareMask");
        // Logger.log("finishWriteAlbum======", photoPath);
        if (photoPath != null) {
            //Logger.log("====>>>>图片大小：", jsb.fileUtils.getFileSize(photoPath));

            Global.gUIMgr.hideUI("prepareMask");
            clearTimeout(this.openAlbumTimeOutId);

            let fileData: Uint8Array = jsb.fileUtils.getDataFromFile(photoPath);
            let imageMd5 = Uint8ArrayDd5(fileData);
            let md5FileName = imageMd5 + ".jpg";

            HttpClient.instance.checkImageExsitState(md5FileName, (result: number, errStr: string, serverImagePath: string) => {
                if ((!errStr || errStr.length == 0) && result != -1) {
                    if (result == 0) {//不存在
                        //先md5重命名文件
                        let tempArr: Array<string> = photoPath.split("/");
                        let tempPotoName: string = tempArr[tempArr.length - 1];
                        const ok = jsb.fileUtils.renameFile(Config.Local_Image_Foler, tempPotoName, md5FileName);
                        if (ok) {
                            tempArr[tempArr.length - 1] = md5FileName;
                            photoPath = tempArr.join("/");
                            this.uploadImageWithUploadUrl(photoPath, md5FileName);
                        }
                        else {
                            jsb.fileUtils.removeFile(Config.Local_Image_Foler + tempPotoName);
                            Global.gUIMgr.showPopTip("很抱歉，图片上传重命名未成功");
                        }
                    }
                    else if (result == 1) {//已存在
                        EventManager.instance.dispatchEvent(CommonEvent.Event_uploadPic, serverImagePath);//直接表示图片上传完毕
                    }
                }
                else {
                    Global.gUIMgr.showPopTip("很抱歉，图片上传验证未成功");
                }
            });
        }
    }

    public static uploadImageWithUploadUrl(photoPath: string, imageMd5: string) {
        let httpUrl: string = NetUrlManager.Upload_Url;
        // Logger.log("uploadImageWithUploadUrl=====", httpUrl);
        let photoArr: Array<string> = photoPath.split("/");
        let photoName: string = imageMd5;//photoArr[photoArr.length-1];
        // Logger.log("photoName====", photoName);
        let ts: number = Math.floor(DateUtil.now() / 1000);
        let md5Key: string = Md5Helper.getPhotoMd5Key(photoName, ts);
        // Logger.log("ts=====", ts);
        // Logger.log("md5Key====", md5Key);
        let callRes;
        if (cc.sys.os == cc.sys.OS_IOS) {
            callRes = jsb.reflection.callStaticMethod("NativeOcClass", "uploadImageWithUploadUrl:imagePath:md5Key:timestamp:", httpUrl, photoPath, md5Key, ts.toString());
            if (callRes) {
                //  Global.gUIMgr.showPrepareMask();
            }
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            callRes = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "uploadImageWithUploadUrl", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)I", httpUrl, photoPath, md5Key, ts);
            if (callRes) {
                //  Global.gUIMgr.showPrepareMask();
            }
        }
    }

    public static finishUploadAlbum(message: string) {
        // Global.gUIMgr.hideUI("prepareMask");
        // Logger.log("finishUploadAlbum======", message);
        if (message) {
            let json: JSON = JSON.parse(message);
            if (json["ErrMsg"].length == 0) {
                // {
                //     "Code": 0,
                //         "ErrMsg": "",
                //             "Data": "/upload/userid9527-2018-9-12-17-23-54.jpg"
                // }
                let tempName: string = json["Data"]["Local"];
                if (tempName.lastIndexOf('/') != -1) {
                    tempName = getBaseName(tempName);
                }
                if (json["Code"] == 0) {
                    const serverName: string = json["Data"]["Name"];
                    const serverFileName: string = getBaseName(serverName);
                    const ok = jsb.fileUtils.renameFile(Config.Local_Image_Foler, tempName, serverFileName);
                    if (ok) {
                        EventManager.instance.dispatchEvent(CommonEvent.Event_uploadPic, serverName);
                    }
                    else {
                        jsb.fileUtils.removeFile(Config.Local_Image_Foler + tempName);
                    }
                } else {
                    jsb.fileUtils.removeFile(Config.Local_Image_Foler + tempName);
                    Global.gUIMgr.showPopTip("很抱歉，上传未成功");
                }
            }
            else {
                Global.gUIMgr.showPopTip(json["ErrMsg"]);
            }

        } else {
            Global.gUIMgr.showPopTip("很抱歉，上传未成功");
        }
    }

    public static saveImageToAlbum(filename: string, rotationDegree: number = 0) {
        if (!cc.sys.isNative) {
            return;
        }
        let result = 0;
        if (cc.sys.os == cc.sys.OS_IOS) {
            result = jsb.reflection.callStaticMethod("NativeOcClass", "saveToAlbum:rotationDegree:", filename, rotationDegree);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "saveToAlbum", "(Ljava/lang/String;I)I", filename, rotationDegree);
        }
    }

    public static saveImageToAlbumResponse(result: number) {
        EventManager.instance.dispatchEvent(CommonEvent.Event_SaveImageToAlbumResponse, true);
    }

    //获取电池
    public static getBattery() {
        if (cc.sys.isNative) {
            var battery;
            if (cc.sys.os == "Android") {
                battery = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "BatterLev", "(Ljava/lang/String;)Ljava/lang/String;", "this is a message from js");
            }
            else if (cc.sys.os == "iOS") {
                Logger.log("获取电池ios=====");
                battery = jsb.reflection.callStaticMethod("NativeOcClass", "getBattery");
                battery = Math.round(battery * 100);
            }
            return battery;
        }
        else {
            return 100;
        }
    }

    private static randomMachineId() {
        let machineId: string = LocalStorage.getString("MachineID");
        if (machineId == "") {
            var mahineIdList: Array<string> = [];
            var data = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for (var i = 0; i < 16; i++) {
                mahineIdList.push(data.charAt(Math.random() * data.length));
            }
            machineId = mahineIdList.join("");
            machineId = "H5-" + machineId;
            LocalStorage.setString("MachineID", machineId);
        }
        return machineId;
    }

    //获取原生平台机器码
    public static getMachineId() {
        let machineId: string = "";
        if (cc.sys.isNative) {
            if (cc.sys.os == "Android") {
                machineId = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JniUtil", "getDeviceID", "()Ljava/lang/String;");
            }
            else if (cc.sys.os == "iOS") {
                machineId = jsb.reflection.callStaticMethod("NativeOcClass", "getDeviceID");
            }
            else {
                machineId = this.randomMachineId();
            }
        }
        else {
            machineId = this.randomMachineId();
        }
        return machineId;
    }

    /**
     * 原生平台copy功能
     * @param copyStr 
     */
    public static copyToClipBoard(copyStr) {
        if (cc.sys.isNative) {
            if (cc.sys.os == "Android") {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JniUtil", "copyToClipBoard", "(Ljava/lang/String;)V", copyStr);
                Global.gUIMgr.showPopTip(Global.i18n.translate("native.bridge.copy_to_clipboard"));
            }
            else if (cc.sys.os == "iOS") {
                jsb.reflection.callStaticMethod("NativeOcClass", "copy:", copyStr);
                Global.gUIMgr.showPopTip(Global.i18n.translate("native.bridge.copy_to_clipboard"));
            }
        } else {
            var textArea = document.getElementById("clipBoard");
            if (textArea === null) {
                textArea = document.createElement("textarea");
                textArea.id = "clipBoard";
                textArea.textContent = copyStr;
                document.body.appendChild(textArea);
            }
            textArea.select();
            try {
                const msg = document.execCommand('copy') ? 'successful' : 'unsuccessful';
                Global.gUIMgr.showPopTip(Global.i18n.translate("native.bridge.copy_to_clipboard"));
                document.body.removeChild(textArea);
            } catch (err) {
                Global.gUIMgr.showPopTip("复制到剪贴板失败");
            }
        }
    }

    /**
     * 打开微信
     * @param para 
     */
    public static openWechat(para) {
        var result = 0;
        if (cc.sys.isNative) {
            if (cc.sys.os == "Android") {
                result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openApp", "(Ljava/lang/String;Ljava/lang/String;)I", "com.tencent.mm", "com.tencent.mm.ui.LauncherUI");
            }
            else if (cc.sys.os == "iOS") {
                result = jsb.reflection.callStaticMethod("NativeOcClass", "OpenApp:", "weixin://" + para);
            }
        }

        if (result == 0) {
            Global.gUIMgr.showPopTip("很抱歉，请您先安装微信");
        }
        Logger.debug("open wechat " + result);
    }

    /**
     * 打開qq
     * @param para 
    */
    public static openQQ(para) {
        var result = 0;
        if (cc.sys.isNative) {
            if (cc.sys.os == "Android") {
                result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openApp", "(Ljava/lang/String;Ljava/lang/String;)I", "com.tencent.mobileqq", "com.tencent.mobileqq.activity.SplashActivity");
            }
            else if (cc.sys.os == "iOS") {
                result = jsb.reflection.callStaticMethod("NativeOcClass", "OpenApp:", "mqq://");
            }
        }

        if (result == 0) {
            Global.gUIMgr.showPopTip("很抱歉，请先安装QQ");
        }
        Logger.debug("open qq " + result);
    }

    public static openUrl(url: string) {
        if (cc.sys.isNative) {
            if (cc.sys.os == "Android") {
                cc.sys.openURL(url);
            }
            else if (cc.sys.os == "iOS") {
                for (let index = 0; index < this.openAppApiConfig.length; index++) {
                    let result = jsb.reflection.callStaticMethod("NativeOcClass", "OpenApp:", url);
                }
            }
        } else {
            cc.sys.openURL(url);
        }
    }


    public static openWebViewUrl(url: string) {
        if (cc.sys.isNative) {
            Global.gUIMgr.showPrepareMask();
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                let androidResult = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openWebView", "(Ljava/lang/String;)I", url);
                Logger.log("openWebViewUrl=====android===", androidResult);
                if (!androidResult) {
                    Logger.log("openWebViewUrl==222==", androidResult);
                    // cc.sys.openURL(url);
                    NativeBridge.openChargeUrl(url);
                }
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                let result = jsb.reflection.callStaticMethod("NativeOcClass", "openPay:", url);
                Logger.log("openWebViewUrl=====ios===", result);
                if (!result) {
                    Logger.log("openWebViewUrl=====ios=222==", result);
                    NativeBridge.openChargeUrl(url);
                }
            }
        } else {
            Logger.log("浏览器打开地址=", url);
            NativeBridge.openChargeUrl(url);
        }
    }

    public static openChargeUrl(payUrl: string) {
        if (cc.sys.isBrowser) {
            if (cc.sys.isMobile) {
                Logger.log("browserType========", cc.sys.browserType, cc.sys.BROWSER_TYPE_SAFARI);
                if (cc.sys.browserType == cc.sys.BROWSER_TYPE_SAFARI) {
                    window.open(payUrl, "_parent");
                } else {
                    window.open(payUrl, "_blank");
                }
            } else {
                window.open(payUrl, "_blank");
            }
        } else {
            cc.sys.openURL(payUrl);
        }
    }

    public static vibrate() {
        if (cc.sys.isNative) {
            if (cc.sys.os == "Android") {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "Vibrate", "(I)V", 1000);
            }
            else if (cc.sys.os == "iOS") {
                jsb.reflection.callStaticMethod("NativeOcClass", "Virate");
            }
        }
    }

    //获取本地Ip
    public static getLocalIp() {
        let sysIp: string = "web";
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                sysIp = jsb.reflection.callStaticMethod("NativeOcClass", "getDeviceIPIpAddresses");
            }
            else if (cc.sys.os == cc.sys.OS_ANDROID) {
                sysIp = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getHostIP", "()Ljava/lang/String;");
            }
        }
        Logger.log("获取系统ip====", sysIp);
        return sysIp;
    }

    public static getRemoteIp() {
        let sysIp: string = "web";
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                sysIp = jsb.reflection.callStaticMethod("NativeOcClass", "getOutIPAddress");
            }
        }
        Logger.log("获取系统ip====", sysIp);
        return sysIp;
    }

    //获取buildid
    public static getBuildId() {
        let id: string = "web";
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                id = "ios";
            }
            else if (cc.sys.os == cc.sys.OS_ANDROID) {
                id = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getBuildId", "()Ljava/lang/String;");
            }
        }
        Logger.log("获取代号====", id);
        return id;
    }

    //获取厂商
    public static getProductName() {
        let productName: string = "web";
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                productName = "Apple";
            }
            else if (cc.sys.os == cc.sys.OS_ANDROID) {
                productName = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getDeviceBrand", "()Ljava/lang/String;");
            }
        }
        Logger.log("获取厂商====", productName);
        return productName;
    }

    //获取系统版本
    public static getSystemVersion() {
        let sysVersion: string = "web";
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                sysVersion = jsb.reflection.callStaticMethod("NativeOcClass", "getPhoneVersion");
            }
            else if (cc.sys.os == cc.sys.OS_ANDROID) {
                sysVersion = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getSystemVersion", "()Ljava/lang/String;");
            }
        }
        return sysVersion;
    }

    //获取手机型号
    public static getPhoneType() {
        let iphoneType: string = "web";
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                iphoneType = jsb.reflection.callStaticMethod("NativeOcClass", "getIphoneType");
            }
            else if (cc.sys.os == cc.sys.OS_ANDROID) {
                let andriodBrand = NativeBridge.getProductName();
                iphoneType = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getSystemModel", "()Ljava/lang/String;");
                iphoneType = `${andriodBrand}-${iphoneType}`;
            }
        }
        return iphoneType
    }

    public static getIosVersion() {
        let iosVersion: string = "1.0.0"
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                iosVersion = jsb.reflection.callStaticMethod("NativeOcClass", "getAppVer");
            }
        }
        return iosVersion
    }

    public static getBundleName(): string {
        let bundleName: string = "web"
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                // bundleName = "IOS";
                bundleName = jsb.reflection.callStaticMethod("NativeOcClass", "getAppPackName");
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                bundleName = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAppPackName", "()Ljava/lang/String;");
            }
        }
        return bundleName
    }

    public static getClipBoardContent(): string {
        let clipBoardContent: string = ""
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                clipBoardContent = jsb.reflection.callStaticMethod("NativeOcClass", "getClipboardContent");
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                let res: number = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getClipboardContent", "()I");
                if (res == 1) {
                    clipBoardContent = "nogetandroid";
                }
            }
        }
        Logger.log("getClipBoardContent==", clipBoardContent);
        return clipBoardContent;
    }

    public static afterGetClipBoardContent(clipBoard: string) {
        Logger.log("afterGetClipBoardContent======", clipBoard);
    }

    //1:IOS,2:Andriod
    public static getTerminaltype(): number {
        if (cc.sys.isBrowser) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                return 1;
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                return 2;
            }
            else {
                return 3;
            }
        } else {
            if (cc.sys.os == cc.sys.OS_IOS) {
                return 4;
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                return 5;
            } else {
                return 6;
            }
        }
    }

    public static getDeviceWH(): cc.Size {
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                return cc.view.getFrameSize();
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                let whStr: string = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getDeviceWH", "()Ljava/lang/String;");
                if (whStr && whStr != "") {
                    Logger.log("whStr=====", whStr);
                    let wharr: Array<string> = whStr.split(",");
                    let wNum: number = parseInt(wharr[0]);
                    let hNum: number = parseInt(wharr[1]);
                    Logger.log("wNum======", wNum, hNum);
                    return cc.size(wNum, hNum);
                } else {
                    return cc.view.getFrameSize();
                }
            }
        }
        return cc.view.getFrameSize();
    }

    public static getSecuritInformation(): string {
        let metadataStr: string = "";
        Logger.log("getSecuritInformation==111======", metadataStr);
        return metadataStr;
    }

    public static decryptUrlWithString(encryUrl: string): string {
        let payUrl: string = "";
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                payUrl = jsb.reflection.callStaticMethod("NativeOcClass", "decryptUrlWithString:", encryUrl);
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                payUrl = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "decryptUrlWithString", "(Ljava/lang/String;)Ljava/lang/String;", encryUrl);
            }
        }
        return payUrl;
    }

    public static checkPermission(permission): number{
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            let ret = jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/JniUtil", 
                "checkPermission", 
                "(Ljava/lang/String;)I", 
                permission
                );
            return ret;
        }
        return 0;
    }

    public static requestPermissions(permission, callback = undefined){
        this.checkSelfPermissionCallback = callback;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/JniUtil", 
                "requestPermissions", 
                "(Ljava/lang/String;)V", 
                permission
                );
        }
    }

    public static openPackageSetting(){
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/JniUtil", 
                "openPackageSetting", 
                "(Ljava/lang/String;)V"
                );
        }
    }

    public static checkSelfPermission(permission, callback = undefined){
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            this.checkSelfPermissionCallback = callback;
            let ret = jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/JniUtil", 
                "checkSelfPermission", 
                "(Ljava/lang/String;)Z", 
                permission
                );
            return ret;
        }
        return true;
    }

    // permission: 权限字符串
    // result: 1成功，0失败
    public static onRequestPermissionsResult(permission, result){
        Logger.info("onRequestPermissionsResult", permission, result);
        if(this.checkSelfPermissionCallback){
            this.checkSelfPermissionCallback(permission, result);
        }
    }

}
