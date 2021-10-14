const objStdMessages = require('../include/std_messages_api');
const objUtil = require('../include/wfUtils4Node');
const objLDAP = require('./stdLDAP');
const objDB = require('./mysqlDB');
const objQ = require('q');
const objMailer = require('./mailer');
var nconf = require('nconf');

var funcDoCreateUser = async function (data) {
    //Add code here
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

                var objResult = await createNewUserWithQ(data.firstname, data.lastname, data.email, data.password)
                    .then(function (result) {
                        // This function get called, when success
                        //console.log(result);
                        var resultOper = '{ "userID": ' + JSON.parse(result).result.insertId + ', "firstName":"' + data.firstname + '", "lastName": "' + data.lastname + '", "userName": "' +
                            data.firstname + ' ' + data.lastname + '","userEmail": "' + data.email + '", "authToken":"' + objUtil.gblGenerateToken(256) + '"}';
                        return objStdMessages.stdMessages[0].replace('__RESULT__', resultOper);;
                    }, function (error) {
                        // This function get called, when error
                        //console.log(error);
                        return objStdMessages.stdMessages[1].replace('__RESULT__', '"' + JSON.parse(error).infoMsg + '"');
                    });
                json_output = objResult;
                objResult = null;
            }
        }
        return JSON.parse(json_output);

    } catch (error) {
        console.log(error);
        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        return JSON.parse(json_output);
    }
}

function createNewUserWithQ (firstname, lastname, email, password) {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();

    var sql = "INSERT INTO USER (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, STATUS) VALUES ('" +
        firstname + "','" + lastname + "','" + email + "','" + password +
        "','P')";

    con.query(sql, function (err, result) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            deferred.reject('{"statCode": 500, "infoMsg": "' + err.message + '" }');
        }
        deferred.resolve('{"statCode": 200, "result": ' + JSON.stringify(result) + ' }');
    });
    sql = null;
    objDB.doDisconnect(con);
    return deferred.promise;
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

//########## Internal Function ##########
//Return users record with fields
var funcDoFetchUserDetail = function (userID) {
    //Add code here
    //Add code here
    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();
    var sql = "SELECT FIRST_NAME, LAST_NAME, EMAIL, STATUS FROM USER WHERE (USER_ID = ?)";
    var query_var = [userID];

    con.query(sql, query_var, function (err, result) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            //console.log(err);
            deferred.reject('{"statCode": 500, "infoMsg": "' + err.message + '" }');
        }
        //console.log(result);
        deferred.resolve('{"statCode": 200, "result": ' + JSON.stringify(result[0]) + ' }');
    });
    sql = null;
    query_var = null;
    objDB.doDisconnect(con);
    return deferred.promise;
}

//########## Internal Function ##########
//Check if e-mail address is not used
//Returns 0 for email not found and 1 for email found
function funcEmailFound(email) {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();

    var sql = "SELECT 1 AS OK FROM USER WHERE EMAIL = ? UNION SELECT 0 AS OK FROM DUAL";
    var query_var = [email];
    con.query(sql, query_var, function (err, result) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            deferred.reject('{"statCode": 500, "infoMsg": "' + err.message + '" }');
        }
        deferred.resolve('{"statCode": 200, "result": ' + result[0].OK + ' }');
    });
    sql = null;
    query_var = null;
    objDB.doDisconnect(con);
    return deferred.promise;
}

//########## Internal Function ##########
//Update user email address
//Returns 0 or 1 according to affected rows
function funcUpdateUserBasicData(userid, firstname, lastname) {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();
    var d = new Date();

    var sql = "UPDATE USER SET FIRST_NAME = ?, LAST_NAME = ?, TMSTP_LAST_UPDATE = ? WHERE USER_ID = ?";
    var query_var = [firstname, lastname, objUtil.gblGGetDateTimeUniversalFormat(d), userid];

    con.query(sql, query_var, function (err, result) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            deferred.reject('{"statCode": 500, "infoMsg": "' + err.message + '" }');
        }
        deferred.resolve('{"statCode": 200, "result": ' + result.affectedRows + ' }');
    });
    sql = null;
    query_var = null;
    d = null;
    objDB.doDisconnect(con);
    return deferred.promise;
}

//########## Internal Function ##########
//Update user email address
//Returns 0 or 1 according to affected rows
function funcUpdateEmailAddress(email, userid) {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();

    var sql = "UPDATE USER SET EMAIL = ? WHERE USER_ID = ?";
    var query_var = [email, userid];
    con.query(sql, query_var, function (err, result) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            deferred.reject('{"statCode": 500, "infoMsg": "' + err.message + '" }');
        }
        deferred.resolve('{"statCode": 200, "result": ' + result.affectedRows + ' }');
    });
    sql = null;
    query_var = null;
    objDB.doDisconnect(con);
    return deferred.promise;
}

//########## Internal Function ##########
//Generate account verification request
//Possible returns:
//200: Request ID
//500: Error message
function setAccountRequestWithQ(userID, requestExpiration) {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();
    var d = new Date();
    var dtNow = objUtil.gblGGetDateTimeUniversalFormat(d);

    var sql = "UPDATE USER_ACC_VERIFICATION_REQUEST SET STATUS = 'E', TMSTP_REQUEST_COMPLETION = ? WHERE STATUS='P' AND TIME_TO_SEC(TIMEDIFF(?, ADDTIME(TMSTP_REQUEST_CREATION, ?))) > 0;" +
        "INSERT INTO USER_ACC_VERIFICATION_REQUEST (USER_ID, STATUS, TMSTP_REQUEST_CREATION) VALUES (?, ?, ?);";
    var query_var = [dtNow, dtNow, requestExpiration, userID, 'P', dtNow];

    con.query(sql, query_var, function (err, result) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            deferred.reject('{"statCode": 500, "infoMsg": "' + err.message + '" }');
        }
        deferred.resolve('{"statCode": 200, "result": ' + result[1].insertId + '}');
    });
    sql = null;
    query_var = null;
    d = null;
    dtNow = null;
    objDB.doDisconnect(con);
    return deferred.promise;
}

//########## Internal Function ##########
//Verify if the request is still valid for usage
//Possible returns:
//200: 1 or 0
//500: Error message
function checkAccountVerificationReques(requestID) {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();
    var d = new Date();

    var sql = "SELECT 1 AS OK FROM USER_ACC_VERIFICATION_REQUEST WHERE REQUEST_ID = ? AND STATUS = 'P' UNION SELECT 0 AS OK FROM DUAL";
    var query_var = [requestID];

    con.query(sql, query_var, function (err, result) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            deferred.reject('{"statCode": 500, "infoMsg": "' + err.message + '" }');
        }
        deferred.resolve('{"statCode": 200, "result": ' + result[0].OK + ' }');
    });
    sql = null;
    query_var = null;
    d = null;
    objDB.doDisconnect(con);
    return deferred.promise;
}

//########## ASYNC function called by the API ##########
//Returns 1 or 0 if the user was updated or error details
var funcDoUpdateUser = async function (data) {
    var json_output;

    try {
        if (data.userid == null || data.userid == '' || data.firstname == null || data.firstname == '' || data.lastname == null || data.lastname == '') {
            //Bad request
            json_output = objStdMessages.stdMessages[3];
        } else {
            var userData = await funcUpdateUserBasicData(data.userid, data.firstname, data.lastname)
                .then(function (result) {
                    // This function get called, when success
                    //console.log(result);
                    return result;
                }, function (error) {
                    // This function get called, when error
                    //console.log(error);
                    return error;
                });
            if (JSON.parse(userData).statCode == 200) {
                if (JSON.parse(userData).result == 1) {
                    json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '{ "userUpdated": 1}');
                } else {
                    json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '{ "userUpdated": 0}');
                }
            } else {
                json_output = objStdMessages.stdMessages[1].replace('__RESULT__', '"' + JSON.parse(userData).infoMsg + '"');
            }
            userData = null;
            return JSON.parse(json_output);
        }
    } catch (error) {
        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        return JSON.parse(json_output);
    }
}

//########## ASYNC function called by the API ##########
var funcDoUpdateUserPassword = async function (data) {
    //Add code here
    var result;
    var json_output;

    try {
        if (data.userId == null || data.userId == '' || data.currentPassword == null || data.currentPassword == '' || data.newPassword == null || data.newPassword == '') {
            //Bad request
            json_output = objStdMessages.stdMessages[3];
        } else {
            //Check what autentication method will be used: LDAP or BD
            if (nconf.get('app_parameters:authentication_type') == "LDAP") {
                //Change password in LDAP

                var pwdChangeAttempt = await objLDAP.doChangePassword(data.userId, data.currentPassword, data.newPassword);
                //console.log('statcode: ' + pwdChangeAttempt.statCode);

                json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '{}');
                return JSON.parse(json_output);

            } else {
                //Change password in the DB
               
            }
        }
        
    } catch (error) {
        //json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        //return JSON.parse(json_output);
    }
  
}

//########## ASYNC function called by the API ##########
//Check if e-mail address is not used and update if data.changeifpossible = 1
//Returns 0 or 1
var doValidateEmail = async function(data) {
    var json_output;

    try {
        if (data.email == null || data.email == '') {
            //Bad request
            json_output = objStdMessages.stdMessages[3];
        } else {
            
            var emailFound = await funcEmailFound(data.email)
                .then(function (result) {
                    // This function get called, when success
                    //console.log(result);
                    return result;
                }, function (error) {
                    // This function get called, when error
                    //console.log(error);
                    return error;
                });

            if (JSON.parse(emailFound).statCode == 200) {
                if (JSON.parse(emailFound).result == 1) {
                    //Email found so no updates will be done
                    json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '{ "emailFound": 1, "emailUpdate": 0}');
                } else {
                    //Email not found so updates can be done
                    if (data.changeifpossible != null && data.changeifpossible == 1 && data.userid != null && data.userid != '') {
                        //Do updates if e-mail not found
                        var updateEmail = await funcUpdateEmailAddress(data.email, data.userid)
                            .then(function (result) {
                                // This function get called, when success
                                //console.log(result);
                                return result;
                            }, function (error) {
                                // This function get called, when error
                                //console.log(error);
                                return error;
                            });
                        if (JSON.parse(updateEmail).statCode == 200) {
                             if (JSON.parse(updateEmail).result == 1) {
                              json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '{ "emailFound": 0, "emailUpdate": 1}');
                            } else {
                                json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '{ "emailFound": 0, "emailUpdate": 0}');
                            }
                        } else {
                            json_output = objStdMessages.stdMessages[1].replace('__RESULT__', '"' + JSON.parse(updateEmail).infoMsg + '"');
                        }
                        updateEmail = null;
                    } else {
                        json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '{ "emailFound": 0, "emailUpdate": 0}');
                    }
                }    
            } else {
                json_output = objStdMessages.stdMessages[1].replace('__RESULT__', '"' + JSON.parse(emailFound).infoMsg + '"');
            }
            emailFound = null;
            return JSON.parse(json_output);           
        }

    } catch (error) {
        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        return JSON.parse(json_output);
    }
}

//########## ASYNC function called by the API ##########
//Sends the account verification email
//Returns 0 or 1
var doSendAccountVerificationEmail = async function (data) {
    //Add code here - to be implemented with the following steps:
    //- Send account verification email
    var json_output;

    try {
        if (data.userid == null || data.userid == '') {
            //Bad request
            json_output = objStdMessages.stdMessages[3];
        } else {
            var user = await funcDoFetchUserDetail(data.userid)
                .then(function (result) {
                    // This function get called, when success
                    //console.log(result);
                    return result;
                }, function (error) {
                    // This function get called, when error
                    //console.log(error);
                    return error;
                });
            if (JSON.parse(user).statCode == 200) {

                var userEmail = JSON.parse(user).result.EMAIL;
                var auxResetRequestExpiration = nconf.get('app_parameters:pwd_reset_request_expiration_expression');

                var generateRequest = await setAccountRequestWithQ(data.userid, auxResetRequestExpiration)
                    .then(function (result) {
                        // This function get called, when success
                        //console.log(result);
                        return result;
                    }, function (error) {
                        // This function get called, when error
                        //console.log(error);
                        return error;
                    });
                if (JSON.parse(generateRequest).statCode == 200) {
                    var mailData = {
                        from: 'leonardo.duarte.3107@gmail.com',
                        to: userEmail,
                        subject: 'node-webapp-template: Account Verification',
                        //text: objMailer.pwdResetMailBody.replace('__EMAIL__', data.email).replace('__REQUEST__', JSON.parse(generateRequest).result).replace('__TOKEN__', resetToken)
                        html: objMailer.newAccountVerificationMailBodyHTML.replace('__EMAIL__', userEmail).replace('__REQUEST__', JSON.parse(generateRequest).result)
                    };
                    objMailer.doSendMail(mailData);
                    mailData = null;
                    json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '"An e-mail was sent to &ldquo;' + userEmail + '&rdquo; with a link to verify your account. Please check your mailbox. Request# ' + JSON.parse(generateRequest).result + '"');
                } else {
                    json_output = objStdMessages.stdMessages[1].replace('__RESULT__', '"' + JSON.parse(generateRequest).infoMsg + '"');
                }
                generateRequest = null;
                userEmail = null;
                auxResetRequestExpiration = null;
            } else {
                json_output = objStdMessages.stdMessages[1].replace('__RESULT__', '"An unexpected error has occurred during the process. Please try again later"');
            }
            user = null;
        }
        return JSON.parse(json_output);
    } catch (error) {
        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        return JSON.parse(json_output);
    }
}

//########## ASYNC function called by the API ##########
//Verify if the request is still valid for usage
//Return 0 or 1 according to the request data
var funcDoRequesValidation = async function (requestid) {

    try {
        if (requestid == null || requestid == '') {
            //Bad request
            return 0;
        } else {
            var validRequest = await checkAccountVerificationReques(requestid, '')
                .then(function (result) {
                    // This function get called, when success
                    //console.log(result);
                    return result;
                }, function (error) {
                    // This function get called, when error
                    //console.log(error);
                    return error;
                });
            if (JSON.parse(validRequest).statCode == 200 && JSON.parse(validRequest).result == 1) {
                validRequest = null;
                return 1;
            } else {
                validRequest = null;
                return 0;
            }
        }
    } catch (error) {
        return 0;
    }
}

module.exports = {
    doCreateUser: funcDoCreateUser,
    doUpdateUser: funcDoUpdateUser,
    doUpdateUserPassword: funcDoUpdateUserPassword,
    doFetchUsersList: funcDoFetchUsersList,
    doFetchUserDetail: funcDoFetchUserDetail,
    doFetchUserDeviceList: funcDoFetchUserDeviceList,
    doFetchUserSessionList: doFetchUserSessionList,
    doValidateEmail: doValidateEmail,
    doSendAccountVerificationEmail: doSendAccountVerificationEmail,
    doAccountVerificationRequesValidation: funcDoRequesValidation
}