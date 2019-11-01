const { ccclass, property } = cc._decorator;

@ccclass
export default class ShaderBase {

    public nickName: string = "ShaderBase";

    public vert:string = null;
    public frag:string = null;
}