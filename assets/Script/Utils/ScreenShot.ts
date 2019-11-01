export default class ScreenShot {
   
    private x: number = 0;

    private y: number = 0;

    private width: number = 100;

    private height: number = 100;

    private hasMask: boolean = false;

    private targetWidth: number = 100;

    private targetHeight: number = 100;

    private renderTexture = null;


    /**
     * 
        var ss = new ScreenShot();
        ss.setRect(100, 100, 200, 200);
        ss.setSize(64, 64);
        ss.shot();
        ss.saveToFile("image.png", cc.ImageFormat.JPG, function(){
        cc.log("success");
        });
     * 
     */

    /**
     * 设置截屏区域
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     */
    public setRect(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * 通过节点设置截屏区域
     * @param node
     */
    public setRectFromNode(node: cc.Node) {
        var ox = - node.width * node.anchorX;
        var oy = - node.height * node.anchorY;
        var ex = + node.width * node.anchorX;
        var ey = + node.height * node.anchorY;
        var op = node.convertToWorldSpaceAR(new cc.Vec2(ox, oy));
        var ep = node.convertToWorldSpaceAR(new cc.Vec2(ex, ey));
        this.x = op.x;
        this.y = op.y;
        this.width = ep.x - op.x;
        this.height = ep.y - op.y;
    }


    /**
     * 设置截屏后保存的尺寸
     * @param width 
     * @param height 
     */
    public setSize(width: number, height: number) {
        this.targetWidth = width;
        this.targetHeight = height;
    }

    public shot() {
        var scene = cc.director.getScene();
        var canvas = cc.find("/Canvas");
        var rt = this.createRenderTexture(canvas.width, canvas.height);
        rt.begin();
        cc.director.getRunningScene().visit();
        rt.end();
        var scaleX = this.targetWidth / this.width;
        var scaleY = this.targetHeight / this.height;
        var node = new cc.Node();
        node.width = canvas.width;
        node.height = canvas.height;
        node.scaleX = scaleX;
        node.scaleY = scaleY;
        node.x = (node.width / 2 - this.x) * scaleX;
        node.y = (node.height / 2 - this.y) * scaleY;
        node._sgNode.addChild(rt);
        cc.director.getScene().addChild(node);

        this.renderTexture = this.createRenderTexture(this.targetWidth, this.targetHeight);
        this.renderTexture.begin();
        cc.director.getRunningScene().visit();
        this.renderTexture.end();
        node.destroy();
    }

    public saveToFile(path: string, format: cc.ImageFormat, callback: Function) {
        if (null == this.renderTexture) {
            throw new Error("请先截图！");
        }
        this.renderTexture.saveToFile(path, format, true, callback);
    }

    private createRenderTexture(width, height) {
        if (this.hasMask) {
            return cc.RenderTexture.create(width, height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        } else {
            return cc.RenderTexture.create(width, height);
        }
    }

}