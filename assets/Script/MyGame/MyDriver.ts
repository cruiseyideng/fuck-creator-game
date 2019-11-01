import Driver from "../Game/Driver";
import MyInitGlobal from "./MyInitGlobal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MyDriver extends Driver{

    overrideInitGlobal(){
        return MyInitGlobal;
    }

}