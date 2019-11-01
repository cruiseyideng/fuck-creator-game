import ShaderHelper from "./ShaderHelper";
import GaussBlursShader from "./GaussBlursShader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GaussBlurEffect extends cc.Component {

    /**
     * 模糊
     */
    program: cc.GLProgram;

    @property({ type: cc.Float })
    bluramount:number = 0.10; //模糊度

    onLoad() {
        // this.bluramount = this.slider.progress / 10;
        this.userBlur();
    }

    start() {
    }

    userBlur() {
        this.program = new cc.GLProgram();
        this.program = ShaderHelper.createWithGlProgram(GaussBlursShader.blurs_vert, GaussBlursShader.blurs_frag);
        this.program.use();
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformFloat("bluramount", this.bluramount);
        } else {
            let ba = this.program.getUniformLocationForName("bluramount");
            this.program.setUniformLocationWith1f(ba, this.bluramount);
        }
        ShaderHelper.setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
    }

    changeBlurAmount(amount: number) {
        if (this.program) {
            this.program.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
                glProgram_state.setUniformFloat("bluramount", this.bluramount);
            } else {
                let ba = this.program.getUniformLocationForName("bluramount");
                this.program.setUniformLocationWith1f(ba, this.bluramount);
            }
        }
    }
}
