const { ccclass, property } = cc._decorator;

@ccclass
export default class WebUtil {

    //获取地址栏参数，name:参数名称
    public static getUrlParms(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
    

}