import ErrorCode from "./ErrorCode";
import { EnumErrorCodeName } from "../../Core/Enum/EnumErrorCode";

/**
 * 服务器异常编码管理
 */

export default class ErrorCodeManager {
    private codes: Object = {};

    init() {
        // this.add(EnumErrorCodeName.DuofuServer, new DuofuServerErrorCode());
    }

    add(name: any, errorCode: ErrorCode) {
        this.codes[name] = errorCode;
    }

    remove(name: any) {
        delete this.codes[name];
    }

    getErrorCode(name: any): ErrorCode | undefined {
        if (this.codes.hasOwnProperty(name)) {
            return this.codes[name];
        }
        return undefined;
    }

    /**
     * 提示给用户或者开发者
     * @param name 
     * @param code 
     * @param logDialogTips log日志的情况情况都弹框
     */
    reportHuman(name: any, code: number, logDialogTips: boolean = false): boolean {
        if (this.codes.hasOwnProperty(name)) {
            let errorCode: ErrorCode = this.codes[name];
            return errorCode.reportHuman(code, logDialogTips);
        }
        return false;
    }
}