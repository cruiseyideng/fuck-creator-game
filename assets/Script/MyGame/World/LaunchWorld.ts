import World from "../../Core/World";
import LaunchUIManager from "../../Game/Manager/LaunchUIManager";
import Global from "../../Game/Global";
import WorldConst from "../../Game/Const/WorldConst";
import { EnumPart } from "../../Game/Enum/EnumPart";

/**
 * 启动
 */

export default class LaunchWorld extends World {

    public name: string = "Launch";
    uiMgr: LaunchUIManager;

    constructor() {
        super();
    }

    initUIMgr() {
        this.uiMgr = new LaunchUIManager();
    }

    init() {
        super.init();
    }

    postInit() {
        super.postInit();
    }

    start() {
        super.start();
        this.enterGame();
    }

    /**
     * 开始游戏逻辑
     */
    enterGame() {
    }

    onDestroy() {
        super.onDestroy();
    }

}