import Global from "../Global";

/**
 * 部件管理器
 */

export default class PartManager {

    register(partNo: number, partClass: any) {
        Global.partFactory.registerPart(partNo, partClass);
    }

    unregister(partNo: number) {
        Global.partFactory.unregisterPart(partNo);
    }

    init() {
        // 注册parts
    }

}