import FluxayShader from "./FluxayShader";
import ShaderHelper from "./ShaderHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FluxayEffect extends cc.Component {

    /**
     * 流光
     */
    @property
    mode: number = 0;

    fragStr: string = null;
    program: cc.GLProgram;
    startTime: number = Date.now();
    time: number = 0;

    onLoad() {
        if (this.mode == 0) {
            this.fragStr = FluxayShader.fluxay_frag;
        } else {
            this.fragStr = FluxayShader.fluxay_frag_super;
        }
        this.userWater();
    }

    start() {
    }

    userWater() {
        this.program = ShaderHelper.createWithGlProgram(FluxayShader.fluxay_vert, this.fragStr);
        this.program.use();
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformFloat("time", this.time);
        } else {
            let ba = this.program.getUniformLocationForName("time");
            this.program.setUniformLocationWith1f(ba, this.time);
        }
        ShaderHelper.setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
    }

    update(dt) {
        this.time = (Date.now() - this.startTime) / 1000;
        if (this.program) {
            this.program.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
                glProgram_state.setUniformFloat("time", this.time);
            } else {
                let ct = this.program.getUniformLocationForName("time");
                this.program.setUniformLocationWith1f(ct, this.time);
            }
        }
    }
}
