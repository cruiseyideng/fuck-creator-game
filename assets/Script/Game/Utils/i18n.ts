import Global from "../Global";
import Logger from "../../Utils/Logger";
import StringUtil from "../../Utils/StringUtil";

/**
 * 多语言
 */

export default class i18n {

    languageObject: Object = {};

    init() {
        Global.loaderMgr.loadRes(Global.pathConfig.languagePath, (error, obj) => {
            if (error) {
                Logger.error("i18n init failed!", Global.pathConfig.languagePath);
                return;
            }
            this.languageObject = obj["json"];
            if (this.languageObject == undefined) {
                Logger.error("i18n json parse failed!", Global.pathConfig.languagePath);
                return;
            }
        })
    }

    /**
     * 强烈推荐用translate
     * @param key string code编号
     */
    translate(key: string, ...args) {
        if (this.languageObject.hasOwnProperty(key)) {
            let text: string = this.languageObject[key];
            let newArgs = [text].concat(args);
            text = StringUtil.format.apply(null, newArgs);
            return text;
        }
        return "";
    }

}