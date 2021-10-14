const objStdMessages = require('../include/std_messages_api');
const objUtil = require('../include/wfUtils4Node');
const objLDAP = require('./ldap');
const objDB = require('./mysqlDB');
const objQ = require('q');
const objUserManagement = require('./userManagement');
const objMailer = require('./mailer');
var nconf = require('nconf');

nconf.file({ file: './config/webapp-template-config.json' });

var funcDoLogin = async function (data, agent) {
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
                var userIDFound = 0;
                var userAuthenticated = false;
                var userIDAttempt = await searchUserOnBDWithQ(data.email)
                    .then(function (result) {
                        // This function get called, when success
                        //console.log(result);
                        return result;
                    }, function (error) {
                        // This function get called, when error
                        //console.log(error);
                        return error;
                    });
                //console.log(JSON.parse(userIDAttempt));
                if (JSON.parse(userIDAttempt).statCode == 200) {
                    if (JSON.parse(userIDAttempt).result == 0) {
                        json_output =  objStdMessages.stdMessages[4].replace('__RESULT__', '"E-mail address not found in the database"');
                    } else {
                        userIDFound = JSON.parse(userIDAttempt).result;
                    }
                } else {
                    json_output =  objStdMessages.stdMessages[1].replace('__RESULT__', '"' + JSON.parse(userIDAttempt).infoMsg + '"');
                }
                userIDAttempt = null;

                if (userIDFound != 0) {
                    //Check which autentication method will be used: LDAP or BD
                    if (nconf.get('app_parameters:authentication_type') == "LDAP") {
                        //Authentication via LDAP
                        var authenticationAttempt = await objLDAP.doAuthenticate(data.email, data.password);
                        if (authenticationAttempt.statCode == 200) {
                            userAuthenticated = true;
                        }
                        authenticationAttempt = null;
                    } else {
                        //Authentication via Database
                        var userSignInAttempt = await authenticateUserOnBDWithQ(userIDFound, data.password)
                            .then(function (result) {
                                // This function get called, when success
                                //console.log(result);
                                return result;
                            }, function (error) {
                                // This function get called, when error
                                //console.log(error);
                                return error;
                            });
                        //console.log(JSON.parse(userSignInAttempt));
                        if (JSON.parse(userSignInAttempt).statCode == 200) {
                            if (JSON.parse(userSignInAttempt).result == 0) {
                                json_output = objStdMessages.stdMessages[4].replace('__RESULT__', '"Wrong password. Sign in aborted!"');
                            } else {
                                userAuthenticated = true;
                            }
                        } else {
                            json_output = objStdMessages.stdMessages[1].replace('__RESULT__', '"' + JSON.parse(userSignInAttempt).infoMsg + '"');
                        }
                        userSignInAttempt = null;
                    }
                } 
            
                //With authenticated user, fetch user details
                if (userAuthenticated) {

                    var authToken = "";
                    authToken = objUtil.gblGenerateToken(256);

                    var userSession = await setUserSessionOnBDWithQ(userIDFound, 1, authToken, 'I')
                        .then(function (result) {
                            // This function get called, when success
                            //console.log(result);
                            return result;
                        }, function (error) {
                            // This function get called, when error
                            //console.log(error);
                            return error;
                        });

                    if (JSON.parse(userSession).statCode == 200 && JSON.parse(userSession).result == "OK") {
                        //Get user details
                        var userDetais = await objUserManagement.doFetchUserDetail(userIDFound)
                            .then(function (result) {
                                // This function get called, when success
                                //console.log(result);
                                return result;
                            }, function (error) {
                                // This function get called, when error
                                //console.log(error);
                                return error;
                            });
                        if (JSON.parse(userDetais).statCode == 200) {
                            var userAuthenticatedWithData = '{ "userID": ' + userIDFound + ', "firstName":"' + JSON.parse(userDetais).result.FIRST_NAME + '", "lastName": "' + JSON.parse(userDetais).result.LAST_NAME + '", "userName": "' +
                                JSON.parse(userDetais).result.FIRST_NAME + ' ' + JSON.parse(userDetais).result.LAST_NAME + '","userEmail": "' + JSON.parse(userDetais).result.EMAIL + '", "userStatus": "' + JSON.parse(userDetais).result.STATUS +'", "authToken":"' + authToken + '"}';
                            json_output = objStdMessages.stdMessages[0].replace('__RESULT__', userAuthenticatedWithData);
                            userAuthenticatedWithData = null;
                        } else {
                            json_output = objStdMessages.stdMessages[1].replace('__RESULT__', '"' + JSON.parse(userDetais).infoMsg + '"');
                        }
                        userDetais = null;

                    } else {
                        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', '"Sign in failed due to an unexpected error. Please try again later."');
                    }
                    authToken = null;
                    userSession = null;
                } else {
                    json_output = objStdMessages.stdMessages[1].replace('__RESULT__', '"Sign in failed due to an unexpected error. Please try again later."');
                }
                userIDFound = null;
                userAuthenticated = null;
            }
        }
        return JSON.parse(json_output);
    } catch(error) {
        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        return JSON.parse(json_output);
    }
}

// Possible returns:
//StatCode 200 with userID or 0 for Not found
//StatCode 500 with error description
function searchUserOnBDWithQ(userEmail) {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();

    var sql = "SELECT USER_ID FROM USER WHERE (EMAIL = ?) UNION SELECT 0 FROM DUAL";
    var query_var = [userEmail];

    con.query(sql, query_var, function (err, result) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            //console.log(err);
            deferred.reject('{"statCode": 500, "infoMsg": "' + err.message + '" }');
        }
        //console.log(result[0].USER_ID);
        deferred.resolve('{"statCode": 200, "result": ' + result[0].USER_ID + ' }') ;
    });
    sql = null;
    query_var = null;
    objDB.doDisconnect(con);
    return deferred.promise;
}

//Possible returns:
//StatCode 200 with result 0 or 1
//StatCode 500 with error description
function authenticateUserOnBDWithQ(userID, userPassword) {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();

    var sql = "SELECT 1 AS OK FROM USER WHERE (USER_ID = ?) AND (PASSWORD = ?) UNION SELECT 0 AS OK FROM DUAL";
    var query_var = [userID, userPassword];

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

//Possible returns:
//200: Ok
//500: Error message
//Set user session record according to the opereation
//operationType I => Sign In
//operationType O => Sign Out
function setUserSessionOnBDWithQ(userID, userDevice, userAuthToken, operationType) {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();
    var d = new Date();

    if (operationType == 'I') {
        //Sign In
        var sql = "DELETE FROM USER_SESSIONS WHERE USER_ID = ? AND DEVICE_ID = ?; "+
                "INSERT INTO USER_SESSIONS (USER_ID, DEVICE_ID, AUTH_TOKEN, TMSTP_LOGIN) VALUES (?, ?, ?, ?);";
        var query_var = [userID, userDevice, userID, userDevice, userAuthToken, objUtil.gblGGetDateTimeUniversalFormat(d)];
    } else {
        //Sign Out
        var sql = "DELETE FROM USER_SESSIONS WHERE USER_ID = ? AND DEVICE_ID = ?;";
        var query_var = [userID, userDevice];
    }

    con.query(sql, query_var, function (err, result) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            deferred.reject('{"statCode": 500, "infoMsg": "' + err.message + '" }');
        }
        deferred.resolve('{"statCode": 200, "result": "OK" }');
    });
    sql = null;
    query_var = null;
    d = null;
    objDB.doDisconnect(con);
    return deferred.promise;
}

var funcDoResetPassword = async function (data) {
    //Add code here - to be implemented with the following steps:
    //- Send password reset e-mail
    //- Adjust in the index page to open a reset modal for password change and new sign in
    var json_output;

    try {
        if (data.userid == null || data.userid == '' || data.password == null || data.password == '' || data.requestid == null || data.requestid == '' || data.token == null || data.token == '') {
            //Bad request
            json_output = objStdMessages.stdMessages[3];
        } else {
            //Check which autentication method will be used: LDAP or BD
            if (nconf.get('app_parameters:authentication_type') == "LDAP") {
                //Perform password change in LDAP
            } else {
                //Perform password change in DB
                //Step 1 - Validate token
                var validTokenInRequest = await checkResetPwdRequestWithQ(data.requestid, data.token)
                    .then(function (result) {
                        // This function get called, when success
                        //console.log(result);
                        return result;
                    }, function (error) {
                        // This function get called, when error
                        //console.log(error);
                        return error;
                    });
                if (JSON.parse(validTokenInRequest).statCode == 200 && JSON.parse(validTokenInRequest).result == 1) {

                    //Step 2 - Update password and close request
                    var resetPassword = await setUserPasswordAndCloseRequestOnBDWithQ(data.userid, data.password, data.requestid)
                        .then(function (result) {
                            // This function get called, when success
                            //console.log(result);
                            return result;
                        }, function (error) {
                            // This function get called, when error
                            //console.log(error);
                            return error;
                        });
                    if (JSON.parse(resetPassword).statCode == 200 && JSON.parse(resetPassword).result == "OK") {
                        json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '"User password was changed successfuly."');
                    } else {
                        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', '"Password change has failed due to an unexpected error. Please try again later."');
                    }
                    resetPassword = null;
                } else {
                    json_output = objStdMessages.stdMessages[5].replace('__RESULT__', '"Password change has failed due to an invalid Reset Token. Please check the value provided and try again."');
                }
                validTokenInRequest = null;
            }
        }
        return JSON.parse(json_output);
    } catch (error) {
        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        return JSON.parse(json_output);
    }
}

//Return 0 or 1 according to the request data
var funcDoRequesValidation = async function (requestid) {

    try {
        if (requestid == null || requestid == '') {
            //Bad request
            return 0;
        } else {
            var validRequest = await checkResetPwdRequestWithQ(requestid, '')
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
                return 1;
            } else {
                return 0;
            }
            validRequest = null;
        }
    } catch (error) {
        return 0;
    }
}

//Possible returns:
//200: 1 or 0
//500: Error message
function checkResetPwdRequestWithQ(requestID, requestToken) {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();
    var d = new Date();

    if (requestToken == '') {
        //Only validate if request is pending for action
        var sql = "SELECT 1 AS OK FROM USER_RESET_PWD_REQUEST WHERE REQUEST_ID = ? AND STATUS = 'P' UNION SELECT 0 AS OK FROM DUAL";
        var query_var = [requestID];
    } else {
        var sql = "SELECT 1 AS OK FROM USER_RESET_PWD_REQUEST WHERE REQUEST_ID = ? AND RESET_TOKEN = ? UNION SELECT 0 AS OK FROM DUAL";
        var query_var = [requestID, requestToken];
    }

    con.query(sql, query_var, function (err, result) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            deferred.reject('{"statCode": 500, "infoMsg": "' + err.message + '" }');
        }
        deferred.resolve('{"statCode": 200, "result": '+ result[0].OK + ' }');
    });
    sql = null;
    query_var = null;
    d = null;
    objDB.doDisconnect(con);
    return deferred.promise;
}

//Possible returns:
//200: DB record
//500: Error message
var funcFetchRequestDetailsWithQ = async function (data) {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();

    var sql = "SELECT R.USER_ID, U.EMAIL FROM USER_RESET_PWD_REQUEST R, USER U WHERE R.USER_ID = U.USER_ID AND R.REQUEST_ID = ?";
    var query_var = [data.requestid];

    con.query(sql, query_var, function (err, result) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            deferred.reject(JSON.parse('{"statCode": 500, "statMsg":"Internal Server Error", "infoMsg": "' + err.message + '" }'));
        }
        deferred.resolve(JSON.parse('{"statCode": 200, "result": {"email":"' + result[0].EMAIL + '","userid":' + result[0].USER_ID + '}}'));
    });
    sql = null;
    query_var = null;
    objDB.doDisconnect(con);
    return deferred.promise;
}

//Possible returns:
//200: Ok
//500: Error message
function closeResetPwdRequestWithQ(requestID) {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();
    var d = new Date();

    var sql = "UPDATE USER_RESET_PWD_REQUEST SET STATUS = ?, TMSTP_REQUEST_COMPLETION = ? WHERE REQUEST_ID = ?";
    var query_var = ['C', objUtil.gblGGetDateTimeUniversalFormat(d), requestID];

    con.query(sql, query_var, function (err, result) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            deferred.reject('{"statCode": 500, "infoMsg": "' + err.message + '" }');
        }
        deferred.resolve('{"statCode": 200, "result": "OK" }');
    });
    sql = null;
    query_var = null;
    d = null;
    objDB.doDisconnect(con);
    return deferred.promise;
}

//Possible returns:
//200: Ok
//500: Error message
function setUserPasswordAndCloseRequestOnBDWithQ(userID, userNewPassword, requestID)  {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();
    var d = new Date();

    if (requestID != '') {
        //Update pwd and close request
        var sql = "UPDATE USER SET PASSWORD = ?, TMSTP_LAST_UPDATE = ? WHERE USER_ID = ?;" + 
                  "UPDATE USER_RESET_PWD_REQUEST SET STATUS = 'C', TMSTP_REQUEST_COMPLETION = ? WHERE REQUEST_ID = ?;";
        var query_var = [userNewPassword, objUtil.gblGGetDateTimeUniversalFormat(d), userID, objUtil.gblGGetDateTimeUniversalFormat(d), requestID];
    } else {
        //Only update pwd
        var sql = "UPDATE USER SET PASSWORD = ?, TMSTP_LAST_UPDATE = ? WHERE USER_ID = ?";
        var query_var = [userNewPassword, objUtil.gblGGetDateTimeUniversalFormat(d), userID];
    }
    con.query(sql, query_var, function (err, result) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            deferred.reject('{"statCode": 500, "infoMsg": "' + err.message + '" }');
        }
        deferred.resolve('{"statCode": 200, "result": "OK" }');
    });
    sql = null;
    query_var = null;
    d = null;
    objDB.doDisconnect(con);
    return deferred.promise;
}

//Possible returns:
//200: Request ID
//500: Error message
function setUserResetPwdRequestWithQ(userID, requestExpiration, resetToken) {

    var deferred = objQ.defer(); // Use Q
    var con = objDB.doConnect();
    var d = new Date();
    var dtNow = objUtil.gblGGetDateTimeUniversalFormat(d);
   
    var sql = "UPDATE USER_RESET_PWD_REQUEST SET STATUS = 'E', TMSTP_REQUEST_COMPLETION = ? WHERE STATUS='P' AND TIME_TO_SEC(TIMEDIFF(?, ADDTIME(TMSTP_REQUEST_CREATION, ?))) > 0;" + 
              "INSERT INTO USER_RESET_PWD_REQUEST (USER_ID, STATUS, RESET_TOKEN, TMSTP_REQUEST_CREATION) VALUES (?, ?, ?, ?);";
    var query_var = [dtNow, dtNow, requestExpiration, userID, 'P', resetToken, dtNow];

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

var funcDoLogoff = async function (data, agent) {
    //Add code here - to be implemented with the following steps:
    //- Revoke the auth token by deleting the record in USER_SESSIONS
    //- Delete auth cookies
    var json_output;
    try {
        if (data.userid == null || data.userid == '') {
            //Bad request
            json_output = objStdMessages.stdMessages[3];
        } else {

            var userSession = await setUserSessionOnBDWithQ(data.userid, 1, '','O')
                .then(function (result) {
                    // This function get called, when success
                    //console.log(result);
                    return result;
                }, function (error) {
                    // This function get called, when error
                    //console.log(error);
                    return error;
                });
            if (JSON.parse(userSession).statCode == 200 && JSON.parse(userSession).result == "OK") {
                json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '"User signed out successfuly."');
            } else {
                json_output = objStdMessages.stdMessages[1].replace('__RESULT__', '"Sign in has failed due to an unexpected error. Please try again later."');
            }
            userSession = null;
        }
        return JSON.parse(json_output);
    } catch (error) {
        json_output = objStdMessages.stdMessages[1].replace('__RESULT__', "'" + error + "'");
        return JSON.parse(json_output);
    }

}

var funcDoSendPasswordResetEmail = async function (data) {
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
                //UserID must be identified and password changed
                var userIDSearch = await searchUserOnBDWithQ(data.email)
                    .then(function (result) {
                        // This function get called, when success
                        //console.log(result);
                        return result;
                    }, function (error) {
                        // This function get called, when error
                        //console.log(error);
                        return error;
                    });
                if (JSON.parse(userIDSearch).statCode == 200) {
                    if (JSON.parse(userIDSearch).result == 0) {
                        json_output = objStdMessages.stdMessages[4].replace('__RESULT__', '"E-mail address not found in the database"');
                    } else {
                        userIDFound = JSON.parse(userIDSearch).result;

                        var auxResetRequestExpiration = nconf.get('app_parameters:pwd_reset_request_expiration_expression');
                        var resetToken = objUtil.gblGenerateToken(24);

                        var generateRequest = await setUserResetPwdRequestWithQ(userIDFound, auxResetRequestExpiration, resetToken)
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
                            console.log(JSON.parse(generateRequest).result);
                            var mailData = {
                                from: 'leonardo.duarte.3107@gmail.com',
                                to: data.email,
                                subject: 'node-webapp-template: Password Reset',
                                //text: objMailer.pwdResetMailBody.replace('__EMAIL__', data.email).replace('__REQUEST__', JSON.parse(generateRequest).result).replace('__TOKEN__', resetToken)
                                html: objMailer.pwdResetMailBodyHTML.replace('__EMAIL__', data.email).replace('__REQUEST__', JSON.parse(generateRequest).result).replace('__TOKEN__', resetToken)
                            };

                            objMailer.doSendMail(mailData);
                            mailData = null;
                            json_output = objStdMessages.stdMessages[0].replace('__RESULT__', '"An e-mail was sent to &ldquo;' + data.email + '&rdquo; with a link to reset your password. Please check your mailbox. Request# ' + JSON.parse(generateRequest).result + '"');
                        } else {
                            json_output = objStdMessages.stdMessages[1].replace('__RESULT__', '"' + JSON.parse(generateRequest).infoMsg + '"');
                        }
                        auxResetRequestExpiration = null;
                        resetToken = null;
                        generateRequest = null;
                    }
                } else {
                    json_output = objStdMessages.stdMessages[1].replace('__RESULT__', '"' + JSON.parse(userIDSearch).infoMsg + '"');
                }
                userIDSearch = null;
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
    doSendPasswordResetEmail: funcDoSendPasswordResetEmail,
    doResetPassword: funcDoResetPassword,
    doPwdResetRequesValidation: funcDoRequesValidation,
    doFetchRequestDetails: funcFetchRequestDetailsWithQ
}