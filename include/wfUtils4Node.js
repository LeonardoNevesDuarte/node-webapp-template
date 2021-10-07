function gblGenerateToken(varSize) {

    var pieces = "0123456789abcdefghijklmnopqrstuvxwyzABCDEFGHIJKLMNOPQRSTUVXYWZ";
    var result = "";
    var pos = 0;

    if (varSize != null && varSize > 0) {
        for (var i = 0; i < varSize; i++) {
            pos = Math.floor(Math.random() * 61) + 1;

            if (pos > pieces.length) {
                pos = (pieces.length) - 1;
            }
            result = result + pieces[pos];
        }
        return result;
    } else {
        return result;
    }
}

function gblIsAuthTokenValid(varUserId, varAuthhToken) {
    //Add your code here
    return true;
}

function gblIdentifyDevice(data) {
    var posLPar = 0;
    var posRPar = 0;
    var result = "Not identified";

    posLPar = data.indexOf('(');
    posRPar = data.indexOf(')');

    if (posLPar != 0 && posLPar != null && posRPar != null & posRPar != 0) {
         result = data.substring(posLPar+1, posRPar);
    }
    return result;
}

function gblIsEmail(varData) {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(varData);
}

function gblGGetDateUniversalFormat(varDate) {
    //varDate must be a date object;
    var d = '0'+varDate.getDate();
    var m = '0' + (varDate.getMonth()+1);

    return varDate.getFullYear() + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length);
}

function gblGGetDateTimeUniversalFormat(varDate) {
    //varDate must be a date object;
    var d = '0' + varDate.getDate();
    var m = '0' + (varDate.getMonth() + 1);
    var h = '0' + varDate.getHours();
    var mi = '0' + varDate.getMinutes();
    var s = '0' + varDate.getSeconds();

    return varDate.getFullYear() + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length) + ' ' + 
        h.substring(h.length - 2, h.length) + ':' + mi.substring(mi.length - 2, mi.length) + ':' + s.substring(s.length - 2, s.length);
}

module.exports = {
    gblIsEmail: gblIsEmail,
    gblGenerateToken: gblGenerateToken,
    gblIdentifyDevice: gblIdentifyDevice,
    gblGGetDateUniversalFormat, gblGGetDateUniversalFormat,
    gblGGetDateTimeUniversalFormat, gblGGetDateTimeUniversalFormat,
    gblIsAuthTokenValid: gblIsAuthTokenValid
}
