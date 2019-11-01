import Logger from "./Logger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Base64Helper {
    
    public static init(){
        Base64.init();
    }

    public static encode(str:string):string{
        let result: string = Base64.encode(str);
        return result
    }

    public static decode(str: string):string{
        let result = Base64.decode(str);
        return result;
    }

    public static aesEncrypt(content: string, key: string ="DFC3E85633C43925"):string{
        key = CryptoJS.enc.Utf8.parse(key); 
        let encrypted = CryptoJS.AES.encrypt(content, key, {
            iv: key,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        Logger.log("encrypted=======", encrypted);
        return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    }

    public static aesDecrypt(content: string, key: string ="DFC3E85633C43925"):string{
        key = CryptoJS.enc.Utf8.parse(key); 
        let encryptedHexStr = CryptoJS.enc.Hex.parse(content);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: key, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    }
 
}
