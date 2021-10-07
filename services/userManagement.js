const objStdMessages = require('../include/std_messages_api');
const objUtil = require('../include/wfUtils4Node');

var funcDoCreateUser = function (data) {
    //Add code here
    var result;
    var json_output;

    try {
        if (data.firstname == null || data.firstname == '' || data.lastname == null || data.lastname == '' ||
            data.email == null || data.email == '' || data.password == null || data.password == '') {
            //Bad request
            json_output = objStdMessages.stdMessages[3];
        } else {
            if (!objUtil.gblIsEmail(data.email)) {
                //Bad request with info
                json_output = objStdMessages.stdMessages[4].replace('__RESULT__', '"E-mail address invalid or malformed."');;
            } else {
                //The code below is hardcoded. You must add your own code according to your app
                //Rules applied:
                //User returned is always the same
                var authToken = "";
                authToken = objUtil.gblGenerateToken(256);
                result = '{ "userID": 100001, "firstName":"Leonardo", "lastName": "Duarte", "userName": "Leonardo Duarte", ' +
                    '"userEmail": "leonardo.duarte@pobox.com", "authToken":"' + authToken + '"}'
                json_output = objStdMessages.stdMessages[0].replace('__RESULT__', result);
                authToken = null;
                result = null;
            }
        }
        return JSON.parse(json_output);
    } catch (error) {
        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        return JSON.parse(json_output);
    }
}

var funcDoUpdateUser = function (data) {
    //Add code here
}

var funcDoUpdateUserPassword = function (data) {
    //Add code here
}

var funcDoFetchUsersList = function (data) {
    //Add code here
}

var funcDoFetchUserDeviceList = function (userID, authenticationToken) {
    //Add code here
    var result;
    var json_output;

    try {
        if (userID == null || userID == '' || authenticationToken == null || authenticationToken == '') {
            //Bad request
            json_output = objStdMessages.stdMessages[4].replace('__RESULT__', '"User Id and Authentication Token not provided"');
        } else {

            var netAuthToken = authenticationToken.substring(8, authenticationToken.length);
            if (!objUtil.gblIsAuthTokenValid(userID, netAuthToken)) { //
                //Bad request with info
                //json_output = objStdMessages.stdMessages[4].replace('__RESULT__', '"You must be signed in to retrieve this information."');;
                json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '{}');
            } else {

                //The code below is hardcoded. You must add your own code according to your app
                //Rules applied:
                //User device list returned is always the same
                //AuthToken must be updated and returned
                var authToken = "";
                authToken = objUtil.gblGenerateToken(256);

                result = '{ "userID": 100001, "authToken":"' + authToken + '", "deviceList": [' +
                            '{"device_id": 1, "device_description":"My MacBook Pro"},{"device_id": 2, "device_description":"My IPhone X"},'+
                            '{ "device_id": 3, "device_description": "My Samsung Table" }'+
                        ']}';
                json_output = objStdMessages.stdMessages[0].replace('__RESULT__', result);
                authToken = null;
                result = null;
            }
        }
        return JSON.parse(json_output);
    } catch (error) {
        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        return JSON.parse(json_output);
    }
}

var doFetchUserSessionList = function (userID, authenticationToken) {
    //Add code here
    var result;
    var json_output;

    try {
        if (userID == null || userID == '' || authenticationToken == null || authenticationToken == '') {
            //Bad request
            json_output = objStdMessages.stdMessages[4].replace('__RESULT__', '"User Id and Authentication Token not provided"');
        } else {

            var netAuthToken = authenticationToken.substring(8, authenticationToken.length);
            if (!objUtil.gblIsAuthTokenValid(userID, netAuthToken)) { //
                //Bad request with info
                //json_output = objStdMessages.stdMessages[4].replace('__RESULT__', '"You must be signed in to retrieve this information."');;
                json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '{}');
            } else {

                //The code below is hardcoded. You must add your own code according to your app
                //Rules applied:
                //User device list returned is always the same
                //AuthToken must be updated and returned
                var authToken = "";
                authToken = objUtil.gblGenerateToken(256);

                result = '{ "userID": 100001, "authToken":"' + authToken + '", "sessionList": [' +
                    '{"session_date": "01/01/2021 10:00:00", "device_description":"My MacBook Pro"},{"session_date": "01/01/2021 14:00:00", "device_description":"My MacBook Pro"},' +
                    '{ "session_date": "01/01/2021 18:00:00", "device_description": "My IPhone X"}' +
                    ']}';
                json_output = objStdMessages.stdMessages[0].replace('__RESULT__', result);
                authToken = null;
                result = null;
            }
        }
        return JSON.parse(json_output);
    } catch (error) {
        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        return JSON.parse(json_output);
    }
}

var funcDoFetchUsersDetail = function (data) {
    //Add code here
}

module.exports = {
    doCreateUser: funcDoCreateUser,
    doUpdateUser: funcDoUpdateUser,
    doUpdateUserPassword: funcDoUpdateUserPassword,
    doFetchUsersList: funcDoFetchUsersList,
    doFetchUsersDetail: funcDoFetchUsersDetail,
    doFetchUserDeviceList: funcDoFetchUserDeviceList,
    doFetchUserSessionList: doFetchUserSessionList
}