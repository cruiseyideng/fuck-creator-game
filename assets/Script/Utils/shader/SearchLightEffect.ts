import ShaderHelper from "./ShaderHelper";
import SearchLightShader from "./SearchLightShader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SearchLightEffect extends cc.Component {

/**
 * 改特效使用节点锚点必须为(0, 0)
 */

    program: cc.GLProgram;
    startTime: number = Date.now();
    time: number = 0;

    resolution = { x: 0.0, y: 0.0 };
    mouse = { x: 0.0, y: 0.0 };

    onLoad() {
        this.resolution.x = (this.node.getContentSize().width);
        this.resolution.y = (this.node.getContentSize().height);
        let self = this;
        // 添加触摸事件包含鼠标事件
        this.node.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventTouch) {
            // 转化为node的局部坐标
            let touchPos = self.node.convertTouchToNodeSpaceAR(event.touch);
            self.mouse.x = touchPos.x;
            self.mouse.y = touchPos.y;
            self.changeLight();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event: cc.Event.EventTouch) {
            let touchPos = self.node.convertTouchToNodeSpaceAR(event.touch);
            self.mouse.x = touchPos.x;
            self.mouse.y = touchPos.y;
            self.changeLight();
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            // cc.log('touch end');
        }, this);

        this.useShader();
    }

    useShader() {
        this.program = ShaderHelper.createWithGlProgram(SearchLightShader.search_light_vert, SearchLightShader.search_light_frag);
        this.program.use();
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformVec2("resolution", this.resolution);
            glProgram_state.setUniformVec2("mouse", this.mouse);
        } else {
            let res = this.program.getUniformLocationForName("resolution");
            let ms = this.program.getUniformLocationForName("mouse");
            this.program.setUniformLocationWith2f(res, this.resolution.x, this.resolution.y);
            this.program.setUniformLocationWith2f(ms, this.mouse.x, this.mouse.y);
        }
        ShaderHelper.setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
    }

    changeLight() {
        if (this.program) {
            this.program.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
                glProgram_state.setUniformVec2("resolution", this.resolution);
                glProgram_state.setUniformVec2("mouse", this.mouse);
            } else {
                let res = this.program.getUniformLocationForName("resolution");
                let ms = this.program.getUniformLocationForName("mouse");
                this.program.setUniformLocationWith2f(res, this.resolution.x, this.resolution.y);
                this.program.setUniformLocationWith2f(ms, this.mouse.x, this.mouse.y);
            }
        }
    }

    // update (dt) {}
}
