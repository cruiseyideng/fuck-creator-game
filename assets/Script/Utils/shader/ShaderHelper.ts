import ShaderBase from "./ShaderBase";
import GrayShader from "./GrayShader";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShaderHelper {

    private static shaderConfig = {
    }

    public static createWithGlProgram(vert:string, frag:string){
        let glProgram: cc.GLProgram = new cc.GLProgram();
        if (cc.sys.isNative) {
            glProgram.initWithString(vert, frag);
        } else {
            glProgram.initWithVertexShaderByteArray(vert, frag);
            glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        }
        glProgram.link();
        glProgram.updateUniforms();
        return glProgram;
    }

    public static getOrCreateWithGLProgram(shader: ShaderBase){
        if (this.shaderConfig[shader.nickName]){ //相同的shader只创建一个吧
            return this.shaderConfig[shader.nickName];
        }
        let glProgram:cc.GLProgram = this.createWithGlProgram(shader.vert, shader.frag);
        this.shaderConfig[shader.nickName] = glProgram;
        return glProgram;
    }

    public  static setProgram(node:any, program:cc.GLProgram){
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children)
            return;

        for (var i = 0; i < children.length; i++) {
            this.setProgram(children[i], program);
        }
    }

    public static setGLProgram(node: cc.Node, shader: ShaderBase){
        let glProgram:cc.GLProgram = ShaderHelper.getOrCreateWithGLProgram(shader);
        this.setProgram(node._sgNode, glProgram);
    }

    // 恢复默认shader
    public static resetProgram(node: cc.Node) {
        node.getComponent(cc.Sprite)._sgNode.setState(0);
        var children = node.children;
        if (!children)
            return;
        for (var i = 0; i < children.length; i++) {
            this.resetProgram(children[i]);
        }
    }

    // 恢复默认shader
    public static resetShader(node: cc.Node) {
        this.resetProgram(node);
    }

    public static setGray(node:cc.Node){
        ShaderHelper.setGLProgram(node, new GrayShader());
    }
}
