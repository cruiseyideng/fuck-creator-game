
export default class ButtonConst {

    static noneConfig = {type:cc.Button.Transition.NONE};       
    static colorConfig = {type:cc.Button.Transition.COLOR,
                    normal:cc.Color.WHITE,
                    pressed:new cc.Color(211, 211, 211),
                    hover:cc.Color.WHITE,
                    disable:new cc.Color(124, 124, 124),
                    duration:0.1};
    static scaleConfig = {type:cc.Button.Transition.SCALE,
                    duration:0.1,
                    zoomScale:1.2};
}
