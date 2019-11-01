const {ccclass, property} = cc._decorator;

@ccclass
export default class AdapterHelper{

    public static Design_Width:number = 1920;
    public static Design_Height:number = 1080;

    public static fixApdater(){
        if(cc.sys.isNative){
            let framesize = cc.view.getFrameSize();
            let designSize = cc.view.getVisibleSize();
            let visibleOrigin = cc.view.getVisibleSizeInPixel();
            let getDesignResolutionSize = cc.view.getDesignResolutionSize();
            let ratio: number = framesize.height/framesize.width;
            let designRatio: number = AdapterHelper.Design_Height / AdapterHelper.Design_Width;
            if(ratio >= designRatio){
                cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_WIDTH);
                cc.view.setDesignResolutionSize(AdapterHelper.Design_Width, AdapterHelper.Design_Height, cc.ResolutionPolicy.FIXED_WIDTH);
            }else{
                cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_HEIGHT);
                cc.view.setDesignResolutionSize(AdapterHelper.Design_Width, AdapterHelper.Design_Height, cc.ResolutionPolicy.FIXED_HEIGHT);
            }
        }else{
            cc.view.setResolutionPolicy(cc.ResolutionPolicy.SHOW_ALL);
            cc.view.setDesignResolutionSize(AdapterHelper.Design_Width, AdapterHelper.Design_Height, cc.ResolutionPolicy.SHOW_ALL);
        }
    }
}
