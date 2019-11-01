
const { ccclass, property } = cc._decorator;

@ccclass
export default class ColorHelper {

    public static getColor(hexStr: string): cc.Color {
        let color: cc.Color = cc.Color.BLACK;
        return color.fromHEX(hexStr);
    }

}