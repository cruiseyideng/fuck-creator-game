import Global from "../Game/Global";
import CommonEvent from "../Game/Event/CommonEvent";

export enum VerifyType {
    notEmpty = 1 << 0,//非空
    length = 1 << 1,//字符长度,需传入最小长度和最大长度
    number = 1 << 2,//数字 eg. '1.00', '-1.00', '100', 
    pureNumber = 1 << 3,//纯数字 eg. '0123', '1234'
    integer = 1 << 4,//整数 eg. '123', '-123'
    url = 1 << 5,//网址
    email = 1 << 6,//邮箱
    phone = 1 << 7,//手机
    pass = 1 << 8 //密码，字母数字下划线组成,或者可以根据传入的自定义密码正则来定
}

export default class StringUtil {

    public static getFileNameExt(filePath: string) {
        let extConfig: Array<string> = ["png", "jpg", "mp3", "json", "manifest", "plist", "ttf"];
        for (let index = 0; index < extConfig.length; index++) {
            let tempExt: string = extConfig[index];
            if (filePath.lastIndexOf(tempExt) == 0) {
                return tempExt;
            }
        }
        return "";
    }

    public static Uint8ArrayToString(fileData) {
        var dataString = "";
        for (var i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }
        return dataString
    }

    public static stringToUint8Array(str: string) {
        var arr = [];
        for (var i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i));
        }
        var tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array
    }

    public static format(text: string, ...args): string {
        for (let index = 0; index < args.length; index++) {
            const element = args[index];
            if (element == undefined || element == null) {
                text = StringUtil.replaceAll(text, "{" + index + "}", "");
            } else {
                // text = text.replace("{" + index + "}", element.toString());
                text = StringUtil.replaceAll(text, "{" + index + "}", element.toString());
            }
        }
        return text;
    }

    /**
     * 100000次调用，消耗只增加16ms（101-117）
     * 
        let d = DateUtil.now();
        for (let index = 0; index < 1000000; index++) {
            StringUtil.replaceAll("{0}+{0}=2", "{0}", "1")
        }
        let d1 = DateUtil.now();
        console.error("dt:", d1 - d)
        for (let index = 0; index < 1000000; index++) {
            "{0}+{0}=2".replace("{0}", "1")
        }
        let d2 = DateUtil.now();
        console.error("dt2:", d2 - d1)

        结果: 
        dt: 117
        dt2: 101
     * @param text 
     * @param searchValue 
     * @param replaceValue 
     */
    public static replaceAll(text: string, searchValue: string, replaceValue: string): string {
        let newText: string = "";
        let index: number = text.indexOf(searchValue);
        let searchValueLength: number = searchValue.length;
        while (index != -1) {
            newText = newText + text.slice(0, index) + replaceValue;
            text = text.slice(index + searchValueLength);
            index = text.indexOf(searchValue);
        }
        newText = newText + text;
        return newText;
    }


    //--------------------------------------------验证相关--------------------------------------------//
    public static verify(str: string, type: VerifyType, verifyFailCall: Function = null, minLength = 0, maxLength = 0, customPassReg: string = null) {
        let notEmptyFunc = () => { return str.length > 0; }
        let lengthFunc = () => { return str.length >= minLength && str.length <= maxLength; }
        let numberFunc = () => { return new RegExp(/^-?(0|[1-9][0-9]*)\.?[0-9]*$/).test(str); }
        let pureNumberFunc = () => { return new RegExp(/^[0-9]*$/).test(str); }
        let integerFunc = () => { return new RegExp(/^-?(0|[1-9][0-9]*)$/).test(str); }
        let urlFunc = () => { return new RegExp(/^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/).test(str); }
        let emailFunc = () => { return new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(str); }
        let phoneFunc = () => { return new RegExp(/^([1][3,4,5,6,7,8,9])\d{9}$/).test(str); }
        let passFunc = () => { let regStr = customPassReg ? customPassReg : '^\\w+$'; return new RegExp(regStr).test(str); }
        let funcList = [notEmptyFunc, lengthFunc, numberFunc, pureNumberFunc, integerFunc, urlFunc, emailFunc, phoneFunc, passFunc];
        for (let i = 0; i < funcList.length; i++) {
            const func = funcList[i];
            let t = 1 << i
            if ((type & t) && !func()) {
                if (verifyFailCall)
                    verifyFailCall(t);
                return false;
            }
        }
        return true;
    }

    //分转换为元
    public static convertCentsToYuan(cents: number) {
        return cents == 0 ? '0' : (cents / 100).toFixed(2);
    }
}