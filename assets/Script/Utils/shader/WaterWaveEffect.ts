import ShaderHelper from "./ShaderHelper";
import WaterWaveShader from "./WaterWaveShader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WaterWaveEffect extends cc.Component {

    /**
     * 波纹
     */
    program: cc.GLProgram;
    startTime: number = Date.now();
    time: number = 0;

    resolution = { x: 0.0, y: 0.0 };

    onLoad() {
        this.resolution.x = (this.node.getContentSize().width);
        this.resolution.y = (this.node.getContentSize().height);
        this.userWater();
    }

    start() {
    }

    userWater() {
        this.program = ShaderHelper.createWithGlProgram(WaterWaveShader.waterwave_vert, WaterWaveShader.waterwave_frag);
        this.program.use();
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformFloat("time", this.time);
            glProgram_state.setUniformVec2("resolution", this.resolution);
        } else {
            let res = this.program.getUniformLocationForName("resolution");
            let ba = this.program.getUniformLocationForName("time");
            this.program.setUniformLocationWith2f(res, this.resolution.x, this.resolution.y);
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
