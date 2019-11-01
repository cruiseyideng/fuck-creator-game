import Md5Helper from "./Md5Helper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SafeNumber{

    private value:number;
    private valueMd5:string;

    constructor(value:number=0){
        this.setValue(value);
    }

    public setValue(value:number){
        this.value = value;
        this.valueMd5 = Md5Helper.getMd5Str(this.value.toString());
        // console.log("setValue======", this.value, this.valueMd5);
    }

    public getValue(){
        let tempValueMd5 = Md5Helper.getMd5Str(this.value.toString());
        if(tempValueMd5 == this.valueMd5){ //md5校验值没被修改
            return this.value;
        }
        return 0;
    }

}
