import Logger from "./Logger";
import Global from "../Game/Global";

// 本地持久化

export default class NativePersistence{

    private _filePath: string = "";
    private _data: Object = {};

    init(){
        this._filePath = Global.pathConfig.nativePersistencePath;
        if(!cc.sys.isNative){
            Logger.warn("NativePersistence is only supported native runtime!");
            return;
        }
        this._load();
        Logger.info("NativePersistence file path:", this._filePath);
    }

    private _load(){
        if(!jsb.fileUtils.isFileExist(this._filePath)){
            this._data = {};
            return;
        }
        let content = jsb.fileUtils.getStringFromFile(this._filePath);
        try {
            this._data = JSON.parse(content);   
        } catch (error) {
            this._data = {};        
        }
    }

    private _save(){
        let content = JSON.stringify(this._data);
        try {
            jsb.fileUtils.writeStringToFile(content, this._filePath);
        } catch (error) {
            Logger.error("NativePersistence persist failed!!"); 
        }
    }

    setItem(key: string, value: any){
        if(this._data[key] == value){
            return;
        }
        this._data[key] = value;
        this._save();
    }

    getItem(key: string, defaultValue: any = undefined): any{
        if(this._data[key] == undefined){
            return defaultValue;
        }        
        return this._data[key];
    }

}