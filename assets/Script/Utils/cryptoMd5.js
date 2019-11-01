var crypto = require("crypto");
var Buffer = require('buffer').Buffer;

function md5(data){
    return crypto.createHash('md5').update(Buffer.from(data)).digest('hex');
}

module.exports = md5;