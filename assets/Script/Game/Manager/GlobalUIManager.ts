import UIManager from "../../Core/Manager/UIManager";
import UITools from "../../Utils/UITools";

export default class GlobalUIManager extends UIManager {

    constructor() {
        super();
        // this.registerUI("dialogTip", DialogTipView, 1000);
    }

    init() {
    }

    setPersistRoot(persist) {
        for (const key in this.uiDict) {
            let ui = this.uiDict[key];
            if (!UITools.IsNal(ui)) {
                ui.setPersistRoot(persist)
            }
        }
    }
}
