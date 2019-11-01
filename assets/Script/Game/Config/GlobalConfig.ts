
/**
 * 全局配置，需要初始化
 * 特性：
 * 1. GameConfigInfo 重构原则：同一个游戏的描述靠近排列
 */

export default class GlobalConfig {
    // 开启资源更新
    canAssetUpdate: boolean = true;        // 是否资源更新

    gameInfo: Object = {};       // 游戏配置数据

    // 开启测试
    openTest: boolean = false;

    init() {
        if (cc.sys.isNative) {
            if (!cc.sys.isMobile) {
                // this.canAssetUpdate = false;
            }
        } else {
            this.canAssetUpdate = false;
        }
    }

}