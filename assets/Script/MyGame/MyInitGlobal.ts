import InitGlobal from "../Game/InitGlobal";
import Global from "../Game/Global";
import MyWorldManager from "./Manager/MyWorldManager";

export default class MyInitGlobal extends InitGlobal{

    static init(callback) {
        Global.worldMgr = new MyWorldManager();
        super.init(callback);
    }
}