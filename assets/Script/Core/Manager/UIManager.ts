import UIInfo from "../UI/UIInfo";
import BaseView from "../UI/BaseView";
import Logger from "../../Utils/Logger";
import UITools from "../../Utils/UITools";

/**
 * UI管理器
 */

export default class UIManager {

    uiInfoDict: { [name: string]: UIInfo; };
    uiDict: { [name: string]: BaseView; };

    constructor() {
        this.uiInfoDict = {};
        this.uiDict = {};
    }

    onLoad() {

    }

    registerUI(name: string, uiClass: any, zIndex: number = 1) {
        if (this.uiInfoDict[name] != undefined) {
            Logger.error("ui info already exists!", name);
            return;
        }


        // TODO：
        // if (!(uiClass instanceof BaseView)){
        //     Logger.error("ui class must be specified!(and extends BaseView)", name, uiClass.prototype.constructor.name);
        //     return;
        // }
        let info = new UIInfo();
        info.name = name;
        info.uiClass = uiClass;
        info.zIndex = zIndex;
        this.uiInfoDict[name] = info;
    }

    getUIInfo(name: string) {
        return this.uiInfoDict[name];
    }

    getUI<T extends BaseView>(name: string): T {
        return this.uiDict[name] as T;
    }

    showUI(name: string, param: any = undefined) {
        let ui = this.getUI(name);
        if (ui) {
            ui.param = param;
            ui.setVisible(true);
        } else {
            let info: UIInfo = this.getUIInfo(name);
            if (info) {
                ui = Object.create(info.uiClass.prototype);
                ui.constructor(info);
                ui.param = param;
                ui.create();
                this.uiDict[name] = ui;
            } else {
                Logger.error("ui info don't exists!", name);
            }
        }
        return ui;
    }

    hideUI(name: string) {
        let ui = this.getUI(name);
        if (ui) {
            ui.setVisible(false);
        }
        return ui;
    }

    destroyUI(name: string) {
        Logger.error("destroyUI", name);
        let ui = this.getUI(name);
        if (ui) {
            ui.onDestroy();
            this.uiDict[name] = undefined;
        }
    }

    onDestroy() {
        for (const key in this.uiDict) {
            let ui = this.uiDict[key];
            if (!UITools.IsNal(ui)) {
                ui.onDestroy();
            }
        }
    }

}