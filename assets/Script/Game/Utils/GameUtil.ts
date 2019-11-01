import Global from "../Global";
import Logger from "../../Utils/Logger";
import NativeBridge from "../../Utils/NativeBridge";
import DateUtil from "../../Utils/DateUtil";

/**
 * 全局游戏工具
 */

 export default class GameUtil {
     
    static restart() {
        cc.audioEngine.stopAll();
        cc.game.restart();
    }

    static exit() {
        cc.game.end();
    }

    
 }