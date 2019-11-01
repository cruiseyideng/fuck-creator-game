import QR = require("./qrcode");

const { ccclass, property } = cc._decorator;

@ccclass
export default class QRCodeHelper {

    public static drawQRCode(codeNode: cc.Node, url: string = "http://www.baidu.com") {
        let qrCode = new QR.QRCode(-1, QR.QRErrorCorrectLevel.H);
        qrCode.addData(url);
        qrCode.make();
        let ctx: cc.Graphics = codeNode.getComponent(cc.Graphics);
        // ctx.lineWidth = 2;
        let tileW: number = codeNode.width / qrCode.getModuleCount();
        let tileH: number = codeNode.height / qrCode.getModuleCount();
        for (let row = 0; row < qrCode.getModuleCount(); row++) {
            for (let col = 0; col < qrCode.getModuleCount(); col++) {
                if (qrCode.isDark(row, col)) {
                    ctx.fillColor = cc.Color.BLACK;
                } else {
                    ctx.fillColor = cc.Color.WHITE;
                }
                let w = (col + 1) * tileW - (col * tileW);
                let h = (row + 1) * tileW - (row * tileW);
                ctx.rect(col * tileW, row * tileH, w, h);
                ctx.fill();
            }
        }
    }

    public static drawImg() {
        // let size:cc.Size = cc.director.getWinSize();
        // let fileName = "result_share.jpg";
        // let currentDate:Date = new Date();
        // let fullPath:string = jsb.fileUtils.getWritablePath() + fileName;
        // if (jsb.fileUtils.isFileExist(fullPath)) {
        //     jsb.fileUtils.removeFile(fullPath);
        // }
        // //如果要图片高质量 可以使用cc.Texture2D.PIXEL_FORMAT_RGBA8888。
        // var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height), cc.Texture2D.PIXEL_FORMAT_RGBA4444, gl.DEPTH24_STENCIL8_OES);
        // texture.setPosition(cc.v2(size.width / 2, size.height / 2));
        // texture.begin();
        // cc.director.getScene().visit();
        // texture.end();
        // //1.4 以后，截屏函数的第二个参数改成了 cc.ImageFormat.PNG
        // texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG);
    }
}
