import Global from "../../Game/Global";
import BaseView, { EnumEditBoxEvent } from "./BaseView";
import { EnumButtonType } from "../../Game/Enum/EnumButtonType";
import { EnumAudio } from "../../Game/Enum/EnumAudio";
import UITools from "../../Utils/UITools";
import Logger from "../../Utils/Logger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIRootComponent extends cc.Component {
    private _view: BaseView;

    buttonSoundList = [];
    eventsButtonList: any[] = [];

    start() {
        if (this._view) {
            this._view.start();
        }
    }

    addClickEvent(button: cc.Button, eventData: string, sound: EnumAudio, param: any = null) {
        this.buttonSoundList[eventData] = sound;
        if (sound != EnumAudio.none) {
            this.buttonSoundList[eventData] = sound;
        }
        let data = eventData + "&" + param;
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this._view.root;
        clickEventHandler.component = "UIRootComponent";
        clickEventHandler.handler = "onClick";
        clickEventHandler.customEventData = data;

        if (!button.clickEvents) {
            Logger.error("critical: only support adding event to button.")
        } else {
            button.clickEvents.push(clickEventHandler);
        }
        this.eventsButtonList.push(button);
    }

    addEditBoxEvent(editBox: cc.EditBox, evtType: EnumEditBoxEvent, handlerName: string, customData) {
        if (editBox instanceof cc.EditBox) {
            let data = `${handlerName}&${customData}`;
            let handlerList: cc.Component.EventHandler[] = null;
            if (evtType == EnumEditBoxEvent.didBegan)
                handlerList = editBox.editingDidBegan;
            else if (evtType == EnumEditBoxEvent.textChanged)
                handlerList = editBox.textChanged;
            else if (evtType == EnumEditBoxEvent.edtitEnded)
                handlerList = editBox.editingDidEnded;
            else if (evtType == EnumEditBoxEvent.editReturn)
                handlerList = editBox.editingReturn;

            if (handlerList == null) {
                Logger.error(`critical: editBox did not suport type <${evtType}>`);
                return;
            }
            let handler = new cc.Component.EventHandler();
            handler.target = this._view.root;
            handler.component = "UIRootComponent";
            handler.handler = "onEditBoxEvent";
            handler.customEventData = data;
            handlerList.push(handler);
        }
        else {
            Logger.error("critical: only support adding event to editBox.")
        }
    }
    addSlideEvent(slider: cc.Slider, eventData: string, param: any = null) {
        let data = eventData + "&" + param;
        let handler = new cc.Component.EventHandler();
        handler.target = this._view.root;
        handler.component = "UIRootComponent";
        handler.handler = "onSlide";
        handler.customEventData = data;

        if (!slider.slideEvents) {
            Logger.error("critical: only support adding event to slider.")
        } else {
            slider.slideEvents.push(handler);
        }
    }

    update(dt) {
        if (this._view) {
            this._view.update(dt);
        }
    }

    onClick(event, data) {
        let list = data.split("&");
        let eventName = list[0];
        if (!UITools.IsNal(this.buttonSoundList[eventName])) {
            Global.audioMgr.playSound(this.buttonSoundList[eventName]);
        }
        if (this._view) {
            let func: Function = this._view[eventName];
            if (func) {
                func.call(this._view, event, list[1]);
            }
        } else {
            Logger.log("critical: view undefined")
        }
    }

    onEditBoxEvent(arg0, arg1, arg2) {
        let evtData = arg1;
        evtData = arg2 ? arg2 : arg1;
        let list = evtData.split("&");
        let eventName = list[0];
        if (this._view) {
            let func: Function = this._view[eventName];
            if (func) {
                if (arg2)//textChanged
                    func.call(this._view, arg0, arg1, list[1]);
                else
                    func.call(this._view, arg0, list[1]);
            }
        } else {
            Logger.log("critical: view undefined")
        }

    }
    onSlide(event, data) {
        let list = data.split("&");
        let eventName = list[0];
        if (this._view) {
            let func: Function = this._view[eventName];
            if (func) {
                func.call(this._view, event, list[1]);
            }
        } else {
            Logger.log("critical: view undefined")
        }
    }

    playClickSound() {
        this._view.clickType
    }

    setView(view) {
        this._view = view;
    }

    onDestroy() {
        this._view = undefined;
        // TODO: fix
        // for (const btn of this.eventsButtonList) {
        //     btn.clickEvents = [];
        // }
    }

}
