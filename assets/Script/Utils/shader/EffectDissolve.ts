import ShaderHelper from "./ShaderHelper";
import ShaderDissolve from "./ShaderDissolve";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DissolveEffect extends cc.Component {
    
    noiseTexture: cc.SpriteFrame = null;

    program: cc.GLProgram;
    startTime: number = Date.now();
    time: number = 0.0;

    public addTime:number = 0.01;

    onLoad(){
        
    }
    start(){
        this.useDissolve();
    }

    useDissolve() {
        // 绑定噪音纹理
        this.noiseTexture = this.node.getComponent(cc.Sprite).spriteFrame;
        let texture1 = this.noiseTexture.getTexture();
        let gltext1 = texture1._glID;
        if (cc.sys.isNative) {
        }
        else {
            cc.gl.bindTexture2DN(1, texture1);
        }

        this.program = ShaderHelper.createWithGlProgram(ShaderDissolve.vert, ShaderDissolve.frag);
        this.program.use();

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformFloat("time", this.time);
            glProgram_state.setUniformTexture("texture1", gltext1);
        } else {
            let ba = this.program.getUniformLocationForName("time");
            let text1 = this.program.getUniformLocationForName("texture1");
            this.program.setUniformLocationWith1f(ba, this.time);
            this.program.setUniformLocationWith1i(text1, 1);
        }
        ShaderHelper.setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
    }

    update(dt) {
        // 溶解速度
        this.time += this.addTime;
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

    onDestroy(){
        cc.log("EffectDissolve onDestroy");
    }

}