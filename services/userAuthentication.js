const objStdMessages = require('../include/std_messages_api');
const objUtil = require('../include/wfUtils4Node');

var funcDoLogin = function (data, agent) {
    //Add code here
    var result;
    var json_output;

    try {
        if (data.email == null || data.email == '' || data.password == null || data.password == '') {
            //Bad request
            json_output = objStdMessages.stdMessages[3];
        } else {
            if (!objUtil.gblIsEmail(data.email)) {
                //Bad request with info
                json_output = objStdMessages.stdMessages[4].replace('__RESULT__', '"E-mail address invalid or malformed."');;
            } else {
                //The code below is hardcoded. You must add your own code according to your app
                //Rules applied:
                //Email "leonardo.duarte@pobox.com" is the only one considered OK. Any other will be considered not existent.
                //Password "password" is the only one considered OK. Any other will be considered not validated.
                if (data.email != 'leonardo.duarte@pobox.com') {
                    return JSON.parse(objStdMessages.stdMessages[4].replace('__RESULT__', '"E-mail address not found in the database"'));
                } else {
                    if (data.password != 'password') {
                        json_output = objStdMessages.stdMessages[4].replace('__RESULT__', '"Wrong password. Sign in aborted!"');
                    } else {
                        var authToken = "";
                        authToken = objUtil.gblGenerateToken(256);
                        result = '{ "userID": 100001, "firstName":"Leonardo", "lastName": "Duarte", "userName": "Leonardo Duarte", '+ 
                                 '"userEmail": "leonardo.duarte@pobox.com", "authToken":"' + authToken + '"}'
                        json_output = objStdMessages.stdMessages[0].replace('__RESULT__', result);
                        authToken = null;
                        result = null;
                    }
                }
            }
        }
        return JSON.parse(json_output);
    } catch(error) {
        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        return JSON.parse(json_output);
    }
}

var funcDoLogoff = function (data, agent) {
    //Add code here - to be implemented with the following steps:
    //- Revoke the auth token by deleting the record in USER_SESSIONS
    //- Delete auth cookies
    var json_output;
    try {
        if (data.userid == null || data.userid == '') {
            //Bad request
            json_output = objStdMessages.stdMessages[3];
        } else {
            json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '"User signed out successfuly."');
        }
        return JSON.parse(json_output);
    } catch (error) {
        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        return JSON.parse(json_output);
    }

}

var funcDoPasswordReset = function (data) {
    //Add code here - to be implemented with the following steps:
    //- Send password reset e-mail
    //- Adjust in the index page to open a reset modal for password change and new sign in
    var json_output;

    try {
        if (data.email == null || data.email == '') {
            //Bad request
            json_output = objStdMessages.stdMessages[3];
        } else {
            if (!objUtil.gblIsEmail(data.email)) {
                //Bad request with info
                json_output = objStdMessages.stdMessages[4].replace('__RESULT__', '"E-mail address invalid or malformed."');;
            } else {
                //The code below is hardcoded. You must add your own code according to your app
                //Rules applied:
                //Email "leonardo.duarte@pobox.com" is the only one considered OK. Any other will be considered not existent.
                //Password "password" is the only one considered OK. Any other will be considered not validated.
                if (data.email != 'leonardo.duarte@pobox.com') {
                    return JSON.parse(objStdMessages.stdMessages[4].replace('__RESULT__', '"E-mail address not found in the database"'));
                } else {
                    json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '"An e-mail was sent to &ldquo;' + data.email + '&rdquo; with a link to reset your password. Please check your mailbox."');
                }
            }
        }
        return JSON.parse(json_output);
    } catch (error) {
        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        return JSON.parse(json_output);
    }
}

module.exports = {
    doLogin: funcDoLogin,
    doLogoff: funcDoLogoff,
    doPasswordReset: funcDoPasswordReset
}