import ShaderHelper from "./ShaderHelper";
import TransferShader from "./TransferShader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TransferEffect extends cc.Component {

    /**
     * 逐渐消失或者出现
     */
    program: cc.GLProgram;
    time: number = 0;

    private isDismiss:boolean=true;  //true:由出现到消失,false:由消失到出现

    start() {
        this.testShaderB();
        // setTimeout(()=>{
        //     this.isDismiss = false;
        // }, 2000)
    }

    testShaderB() {
        let bgSp: cc.Sprite = this.node.getComponent(cc.Sprite);
        this.program = ShaderHelper.createWithGlProgram(TransferShader.vert, TransferShader.frag);
        this.program.use();

        if (!cc.sys.isNative) {
            let time = this.program.getUniformLocationForName("time");
            this.program.setUniformLocationWith1f(time, this.time);
        } else {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformFloat("time", this.time);
        }
        ShaderHelper.setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
    }

    update(dt) {
        if(this.isDismiss){
            this.time += 0.02;
        }else{
            this.time -= 0.02;
        }
        if (this.program) {
            this.program.use();
            if (!cc.sys.isNative) {
                let time = this.program.getUniformLocationForName("time");
                this.program.setUniformLocationWith1f(time, this.time);
            } else {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
                glProgram_state.setUniformFloat("time", this.time);
            }
        }
    }
}
