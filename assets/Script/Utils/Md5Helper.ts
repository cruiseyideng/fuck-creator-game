import encryptHelper = require("../Utils/encryptHelper");

const { ccclass, property } = cc._decorator;

@ccclass
export default class Md5Helper {

   public static getMd5Str(str:string){
       let md5Key: string = md5(str + Config.Private_Key);
       return md5Key;
   }

   public static getRegisterKey(machineId:string, platformId:string, ip:string){
       let md5Key: string = md5("{" + machineId + ":" + platformId + ":" + ip + ":" + Config.Private_Key + "}");
       return md5Key;
   }

   public static getCacheUserKey(machineId:string){
       let md5Key: string = md5("{" + machineId + ":" + Config.Private_Key + "}");
       return md5Key
   }

    //     参数：
    // - ts, int, 当前时间戳，秒
    //     - name, string, 文件名
    //     - psk, string, 密码
    // 密码格式：
    // 1. 拼接成字符串：name + ts + 密钥
    // 2. md5(md5(拼接字符串) + md5(密钥))
    public static getPhotoMd5Key(photoName: string, ts: number, key: string ="8CA1103B16E4C9C7FF52055E04A5242F"){
        return md5(md5(photoName+ts+key)+md5(key));
    }

    // 临时做法：TODO：之后在引擎中新增一个接口getDataFromFileEncrypted
    public static getDataFromFileEncrypted(filePath: string){
        let fileData: Uint8Array = jsb.fileUtils.getDataFromFile(filePath);
        return encryptHelper(filePath, fileData);
    }
}
