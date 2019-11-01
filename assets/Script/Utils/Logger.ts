const { ccclass } = cc._decorator;

export const enum LEVEL_TYPES { DEBUG, LOG, INFO, WARN, ERROR }

/** 日志控制类 */
@ccclass
export default class Logger {
    public static tag: string = "[Jslog]"; //可以设置当前游戏的前缀

    private static LEVEL: number = LEVEL_TYPES.DEBUG; //当前Logger等级

    public static set logLeveL(lv: LEVEL_TYPES) {
        this.LEVEL = lv;
    }

    public static formatNow() {
        let date: Date = new Date(); //后端返回的时间戳是秒
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
    }

    public static debug(...params) {
        if (Logger.LEVEL > LEVEL_TYPES.DEBUG) {
            return;
        }
        console.trace("[" + Logger.formatNow() + "] " + Logger.tag, ...params);
    }

    public static log(...params) {
        if (Logger.LEVEL > LEVEL_TYPES.LOG) {
            return;
        }
        console.log("[" + Logger.formatNow() + "] " + Logger.tag, ...params);
    }

    public static info(...params) {
        if (Logger.LEVEL > LEVEL_TYPES.INFO) {
            return;
        }
        console.info("[" + Logger.formatNow() + "] " + Logger.tag, ...params);
    }

    public static warn(...params) {
        if (Logger.LEVEL > LEVEL_TYPES.WARN) {
            return;
        }
        console.warn("[" + Logger.formatNow() + "] " + Logger.tag, ...params);
    }

    public static error(...params) {
        if (Logger.LEVEL > LEVEL_TYPES.ERROR) {
            return;
        }
        console.error("[" + Logger.formatNow() + "] " + Logger.tag, ...params);
    }
}