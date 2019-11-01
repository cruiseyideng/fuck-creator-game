import NativeBridge from "../../Utils/NativeBridge";
import { EnumAndroidPermission } from "../Enum/EnumAndroidPermission";
import Global from "../Global";
import GameUtil from "../Utils/GameUtil";
import Logger from "../../Utils/Logger";

// 平台管理
export default class PlatformManager{

    private _initCallback = undefined;

    // =======================
    //          初始化
    // =======================
    public init(callback){
        this._initCallback = callback;
        if(cc.sys.platform == cc.sys.ANDROID){
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onAndroidKeyPressed, this);
            let ret = this.checkPermissionReadPhone();
            if(ret == 0){
                this._initCallback();
            }
        }else{
            this._initCallback();
        }
    }

    // =======================
    //          android
    // =======================
    // 检查设备信息获取权限
    checkPermissionReadPhone(){
        let ret = NativeBridge.checkPermission(EnumAndroidPermission.READ_PHONE_STATE);
        console.log("checkPermissionReadPhone", ret);
        if(ret != 0){
            NativeBridge.requestPermissions(EnumAndroidPermission.READ_PHONE_STATE, this.requestPermissionReadPhoneCallback.bind(this));
        }
        return ret;
    }

    // 申请权限
    requestPermissionReadPhoneCallback(permission, result){
        if(permission == EnumAndroidPermission.READ_PHONE_STATE){
            if(result == 0){
                //  让用户选择
                Logger.warn("requestPermissionReadPhoneCallback", permission, result);
                return;
            }
        }
        
        this._initCallback();
    }

    // 申请权限选择
    checkPermissionReadPhoneCallbackSure(result){
        if(result){
            NativeBridge.openPackageSetting();
        }else{
            GameUtil.exit();
        }
    }

    // Android按键处理
    onAndroidKeyPressed(event){
    }


}