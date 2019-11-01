var Buffer = require('buffer').Buffer;

function encrypt(filePath, data){
    var arr = filePath.split(".");
    var extName = "";
    if(arr.length > 0){
        extName = arr[arr.length - 1];
    }
    var extList = ["png", "jpg", "mp3", "json", "manifest", "plist", "ttf"];
    if (extList.indexOf(extName) == -1) {
        return data;
    }
    var buf = Buffer.from(data);
    var game_key = "jueyule";
    var tempBuff = Buffer.from(game_key + extName);
    if (buf.indexOf(tempBuff) != -1){
        return data; //已经发现加密完成
    }
    if (extName != "mp3"){
        for (let index = 0; index < buf.length; index++) {
            buf[index] = buf[index];
        }
    }
    var newBuff = Buffer.concat([tempBuff, buf], buf.length);
    return newBuff;
}

module.exports = encrypt;