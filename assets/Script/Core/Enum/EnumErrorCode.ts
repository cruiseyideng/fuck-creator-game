/**
 * 服务器异常处理类型
 */

export enum EnumErrorCodeHandle {
   ServerFetal,        // 服务器灾难
   ServerCritical,     // 服务器问题，急需处理
   ClientDevError,     // 客户端请求异常，开发解决
   PopTipsReportUser,  // 飘字告知用户
   DialogTipsReportUser,  // 弹框告知用户
}

export enum EnumErrorCodeName {
   LoginServer = 'LoginServer',
   HallServer = "HallServer",
   GameFactory = "GameFactory",
   KickOutServer = "KickOutServer",
   // DuofuServer = "DuofuServer"
}