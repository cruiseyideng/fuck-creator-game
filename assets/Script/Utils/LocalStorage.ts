import Global from "../Game/Global";
/**
 * 全局工具类：本地存储
 */

export default class LocalStorage {

    public static setItem(key: string, value: string) {
        cc.sys.localStorage.setItem(Global.config.gameName + key, value);
    }

    public static getItem(key: string): string {
        return cc.sys.localStorage.getItem(Global.config.gameName + key);
    }

    public static removeItem(key: string) {
        cc.sys.localStorage.removeItem(Global.config.gameName + key);
    }

    public static clear() {
        cc.sys.localStorage.clear();
    }

    /**
     * @param key string
     * @param value string
     */
    public static setString(key: string, value: string) {
        LocalStorage.setItem(key, value);
    }

    /**
     * 
     * @param key string
     */
    public static getString(key: string, defaultValue: string = ""): string {
        let value = LocalStorage.getItem(key);
        if (value == null) {
            return defaultValue;
        }
        return value;
    }

    /**
     * 
     * @param key string
     * @param value number
     */
    public static setInt(key: string, value: number) {
        let valueStr: string = value.toString();
        // Logger.log("setInt=====", valueStr);
        LocalStorage.setItem(key, valueStr);
    }

    /**
     * 不存在则返回0
     * @param key string
     * @return number 
     */
    public static getInt(key: string, defaultValue: number = 0): number {
        let valueStr: string = LocalStorage.getItem(key);
        if (valueStr == null) {
            return defaultValue;
        }
        let valueNum: number = parseInt(valueStr);
        if (isNaN(valueNum)) {
            valueNum = 0;
        }
        // Logger.log("getInt=====", valueStr, valueNum);
        return valueNum;
    }

    /**
     * 
     * @param key string
     * @param value number
     */
    public static setFloat(key: string, value: number) {
        let valueStr: string = value.toString();
        // Logger.log("setFloat=====", valueStr);
        LocalStorage.setItem(key, valueStr);
    }

    /**
     * 
     * @param key string
     */
    public static getFloat(key: string, defaultValue: number = 0): number {
        let valueStr: string = LocalStorage.getItem(key);
        if (valueStr == null) {
            return defaultValue;
        }
        let valueNum: number = parseFloat(valueStr);
        // Logger.log("getFloat=====", valueStr, valueNum);
        return valueNum;
    }

    /**
     * 
     * @param key string
     * @param value boolen
     */
    public static setBool(key: string, value: boolean) {
        let valueNum = 1;
        if (!value) {
            valueNum = 0;
        }
        let valueStr: string = valueNum.toString();
        // Logger.log("setBool=====", valueStr);
        LocalStorage.setItem(key, valueStr);
    }

    /**
     * 
     * @param key string
     */
    public static getBool(key: string, defaultValue: boolean = false): boolean {
        let valueStr: string = LocalStorage.getItem(key);
        if (valueStr == null) {
            return defaultValue;
        }
        let valueNum: number = parseInt(valueStr);
        let result = false;
        if (valueNum == 1) {
            result = true;
        }
        // Logger.log("getBool=====", valueStr, result);
        return result;
    }
}