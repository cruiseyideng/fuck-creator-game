import { EnumErrorCodeHandle } from "../../Core/Enum/EnumErrorCode";
import Global from "../Global";
import Logger from "../../Utils/Logger";
import GameUtil from "../Utils/GameUtil";
import StringUtil from "../../Utils/StringUtil";

/**
 * 服务器错误编号
 */

export default class ErrorCode {

    static CodeOK = 0;

    private data: Object = {};

    register(code: number, description_or_languageId: string, handleType: EnumErrorCodeHandle) {
        this.data[code] = new ErrorCodeInfo(code, description_or_languageId, handleType);
    }

    getMessage(code: number, ...args): string {
        if (this.data.hasOwnProperty(code)) {
            let info: ErrorCodeInfo = this.data[code];
            let description: string = info.description;
            let newArgs = [description].concat(args);
            let msg: string = Global.i18n.translate.apply(Global.i18n, newArgs);
            if (msg != "") {
                return msg;
            }
            return description;
        }
        if (code > ErrorCode.CodeOK) {
            return code.toString();
        }
        return "";
    }

    private getInfo(code: number): ErrorCodeInfo | undefined {
        if (this.data.hasOwnProperty(code)) {
            return this.data[code];
        }
        return undefined;
    }

    /**
     * 提示给用户或者开发者
     */
    reportHuman(code: number, logDialogTips: boolean = false): boolean {
        let info: ErrorCodeInfo = this.getInfo(code);
        if (!info) {
            let msg = StringUtil.format("通信数据异常，错误码：{0}", code);
            Logger.error(msg);
            if (logDialogTips) {
                // Global.gUIMgr.showDialogTip(msg, DialogTipView.TYPE_SURE, (isOk) => {
                //     GameUtil.restart();
                // });
                return true;
            }
            return false;
        }
        if (info.handleType == EnumErrorCodeHandle.PopTipsReportUser) {
            // Global.gUIMgr.showPopTip(this.getMessage(code));
            return true;
        }
        if (info.handleType == EnumErrorCodeHandle.DialogTipsReportUser) {
            Global.gUIMgr.showDialogTip(this.getMessage(code), DialogTipView.TYPE_SURE);
            return true;
        }
        if (info.handleType == EnumErrorCodeHandle.ServerFetal) {
            // Global.gUIMgr.showDialogTip("很抱歉，似乎出了一些问题，正在努力修复...", DialogTipView.TYPE_SURE, (isOk) => {
            //     GameUtil.restart();
            // });
            return true;
        }
        if (info.handleType == EnumErrorCodeHandle.ServerCritical) {
            let msg = StringUtil.format("服务器异常，错误码：{0}", code);
            Logger.error(msg);
            if (logDialogTips) {
                // Global.gUIMgr.showDialogTip(msg, DialogTipView.TYPE_SURE, (isOk) => {
                //     GameUtil.restart();
                // });
                return true;
            }
            return false;
        }
        if (info.handleType == EnumErrorCodeHandle.ClientDevError) {
            let msg = StringUtil.format("客户端参数异常，错误码：{0}", code);
            Logger.error(msg);
            if (logDialogTips) {
                // Global.gUIMgr.showDialogTip(msg, DialogTipView.TYPE_SURE, (isOk) => {
                //     GameUtil.restart();
                // });
                return true;
            }
            return false;
        }
        return false;
    }
}


export class ErrorCodeInfo {
    code: number;
    description: string;
    handleType: EnumErrorCodeHandle;

    constructor(code: number, description: string, handleType: EnumErrorCodeHandle) {
        this.code = code;
        this.description = description;
        this.handleType = handleType;
    }
}