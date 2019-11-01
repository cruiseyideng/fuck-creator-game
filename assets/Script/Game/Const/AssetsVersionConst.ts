
/**
 * 资源版本常量
 */

export default class AssetsVersionConst {
   static readonly manifestFileName: string = "project.manifest";
   static readonly remoteAssetDirName: string = "{ASSETS_DIR}-remote-asset/";
   static readonly tempRemoteAssetDirNameTemplate: string = "{ASSETS_DIR}-remote-asset_temp/";
   static readonly rawProjectManifestPath: string = "version/project_{ASSETS_DIR}.manifest";
   static readonly writableProjectManifestPathTemplate: string = "{ASSETS_DIR}-remote-asset/project.manifest";

   static readonly errorUpdatingReportTimes: number = 5;   // 错误更新触发文件上报的文件次数
   static readonly failedUpdateAlertTimes: number = 3;    // 更新失败触发提示网络
   static readonly maxConcurrentTask: number = 8;          // 协同任务的最大数量
   static readonly showBytesForever: boolean = false;   // 始终显示字节数
   static readonly maxTotalBytesShown: number = 4 * 1024 * 1024;   // 不超过多少字节数不显示

   static readonly UPDATE_VERSION_ID: string = "@version";
   static readonly UPDATE_MANIFEST_ID: string = "@manifest";
   static readonly UPDATE_NONE_ID: string = "";
   static readonly DEFAULT_VERSION: string = "1.1.0"

   // 热更新的游戏列表
   static readonly updateGameList: string[] = [
   ]


}
