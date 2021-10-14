//Angular setup
var app = angular.module('App', ['brasil.filters', 'ngCookies']);

app.controller('controllerDeviceList', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {

    $scope.deviceList = [];
   
    $scope.doDisplayUserDevices = function () {

        $scope.authenticationToken = "Bearer " + $cookies.get("authToken");
        $scope.userID = $cookies.get("userID");

        var config = {
            method: 'GET',
            url: '/api/doFetchUserDeviceList',
            headers: { authenticationToken: $scope.authenticationToken, userID: $scope.userID },
            params: {},
            timeout: 60000,
        }

        $http(config)
            .then(function success(e) {
                if (e.data.statCode == 200) {
                    //console.log(e.data);
                    $scope.lstDevices = e.data.result.deviceList;
                } else if (e.data.statCode == 400) {                    
                    if (e.data.infoMsg != null && e.data.infoMsg != '') {
                        console.log(e.data.statCode + ' - ' + e.data.infoMsg);
                    } else {
                        console.log(e.data.statCode + ' - ' + e.data.statMsg);
                    }
                    $scope.lstDevices = '';
                } else {
                    console.log(e.data.statCode + ' - ' + e.data.statMsg);
                }
            }, function error(e) {
                if (e.xhrStatus == "timeout") {
                    //$('#mdlGlbAlertasErroTimeout').modal();
                }
            });
    };
}]);

app.controller('controllerSessionList', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {

    $scope.sessionList = [];

    $scope.doDisplayUserSessions = function () {

        $scope.authenticationToken = "Bearer " + $cookies.get("authToken");
        $scope.userID = $cookies.get("userID");

        var config = {
            method: 'GET',
            url: '/api/doFetchUserSessionList',
            headers: { authenticationToken: $scope.authenticationToken, userID: $scope.userID },
            params: {},
            timeout: 60000,
        }

        $http(config)
            .then(function success(e) {
                if (e.data.statCode == 200) {
                    //console.log(e.data);
                    $scope.lstSessions = e.data.result.sessionList;
                } else if (e.data.statCode == 400) {
                    if (e.data.infoMsg != null && e.data.infoMsg != '') {
                        console.log(e.data.statCode + ' - ' + e.data.infoMsg);
                    } else {
                        console.log(e.data.statCode + ' - ' + e.data.statMsg);
                    }
                    $scope.lstSessions = '';
                } else {
                    console.log(e.data.statCode + ' - ' + e.data.statMsg);
                }
            }, function error(e) {
                if (e.xhrStatus == "timeout") {
                    //$('#mdlGlbAlertasErroTimeout').modal();
                }
            });
    };
}]);

//######################################################
//###################  Page objects  ###################
//######################################################

//Attach event listeners to UI objects
document.getElementById("gblObjSignUpButton").addEventListener("click", function () { gblCleanUpForm('gblObjSignUpForm'); $('#gblObjSignUpBox').modal(); });
document.getElementById("gblObjSignInButton").addEventListener("click", function () { gblCleanUpForm('gblObjSignInpBox'); $('#gblObjSignInpBox').modal(); });
document.getElementById("gblObjSignOutButton").addEventListener("click", function () { $('#gblObjSignOutBox').modal(); });
document.getElementById("gblObjSignInForgotPasswordButton").addEventListener("click", function () { $('#gblObjSignInpBox').modal('hide'); gblCleanUpForm('gblObjForgotPwdForm'); $('#gblObjForgotPwdBox').modal(); });
document.getElementById("gblObjSignUpTrySignUpButton").addEventListener("click", funDoSignUp);
document.getElementById("gblObjSignInTrySignInButton").addEventListener("click", funDoSignIn);
document.getElementById("gblObjTrySendForgotPwdButton").addEventListener("click", funDoForgotPassword);
document.getElementById("gblObjTryResetPwdButton").addEventListener("click", funDoResetPassword);
document.getElementById("gblObjSignOutTrySignOutButton").addEventListener("click", funDoSignOut);


document.getElementById("tempOpenErrorMessageBoxButton").addEventListener("click", function() { funOpenMessageBox('E'); });
document.getElementById("tempOpenWarningMessageBoxButton").addEventListener("click", function() { funOpenMessageBox('W'); });
document.getElementById("tempOpenSuccessMessageBoxButton").addEventListener("click", function() { funOpenMessageBox('S'); });
document.getElementById("tempOpenConfirmationMessageBoxButton").addEventListener("click", function () { funOpenConfirmationMessageBox(); });
document.getElementById("tempResetPasswordBoxButton").addEventListener("click", function () { $('#gblObjPwdResetBox').modal(); });
//document.getElementById("tempValidateAccountButton").addEventListener("click", function () { funOpenMessageBox('S'); });

const objNotice = new Notice();

//######################################################
//###################  Page functions ##################
//######################################################

function funLocalCallBackForConfirmation() {
    $('#gblObjConfirmationBox').modal('hide');
    funOpenMessageBox('S');
}

function funOpenConfirmationMessageBox() {
    var params = [];

    params[0] = "This is a confirmation message box";
    params[1] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at mi augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec varius tempor turpis, sed lobortis quam suscipit sed. Ut ut vulputate dolor. Nullam libero turpis, aliquam at luctus sed, porta vel felis.";
    params[2] = funLocalCallBackForConfirmation;

    gblSetAndOpenConfirmationBox(params);
}

function funOpenMessageBox(varType) {

    var params = [];

    if(varType == 'E') {
        params[0] = varType;
        params[1] = "This is an error message box";
        params[2] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at mi augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec varius tempor turpis, sed lobortis quam suscipit sed. Ut ut vulputate dolor. Nullam libero turpis, aliquam at luctus sed, porta vel felis.";
    } else if (varType == 'W') {
        params[0] = varType;
        params[1] = "This is a warning message box";
        params[2] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at mi augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec varius tempor turpis, sed lobortis quam suscipit sed. Ut ut vulputate dolor. Nullam libero turpis, aliquam at luctus sed, porta vel felis.";
    } else if (varType == 'S') {
        params[0] = varType;
        params[1] = "This is a success message box";
        params[2] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at mi augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec varius tempor turpis, sed lobortis quam suscipit sed. Ut ut vulputate dolor. Nullam libero turpis, aliquam at luctus sed, porta vel felis.";
    } 
    gblSetAndOpenMessageBox(params);
}

//Page function to perform Password Reset
function funDoResetPassword() {
    if (gblCheckFormForCompletion('gblObjPwdResetForm')) {
        var userid = document.getElementById("gblObjPwdResetUserId").value;
        var requestid = document.getElementById("gblObjPwdResetRequestId").value;
        var email = document.getElementById("gblObjPwdResetEmail").innerHTML;
        var password = document.getElementById("gblObjPwdResetPassword").value;
        var token = document.getElementById("gblObjPwdResetToken").value;

        gblResetPasswordService(userid, password, requestid, token, email, function (result) {
            var obj = "";
            try {
                obj = JSON.parse(result);
                if (obj.statCode == 200 && obj.statMsg == 'OK') {

                    var email = document.getElementById("gblObjPwdResetEmail").innerHTML;
                    var password = document.getElementById("gblObjPwdResetPassword").value;

                    gblAuthenticateUserService(email, password, function (result) {
                        var objSignIn = "";
                        try {
                            objSignIn = JSON.parse(result);

                            if (objSignIn.statCode == 200) {
                                gblSetCookie("userEmail", objSignIn.result.userEmail, 1);
                                gblSetCookie("userID", objSignIn.result.userID, 1);
                                gblSetCookie("authToken", objSignIn.result.authToken, 1);
                                gblSetCookie("userName", objSignIn.result.userName, 1);
                                gblSetCookie("userFirstName", objSignIn.result.firstName, 1);
                                gblSetCookie("userLastName", objSignIn.result.lastName, 1);
                                gblSetCookie("userStatus", objSignIn.result.userStatus, 1);
                                $('#gblObjPwdResetBox').modal('hide');
                                funSignInManagement();
                                glbShowHideDiv('gblObjSignUpButton', 0);
                                glbShowHideDiv('gblObjSignInButton', 0);

                                var params = [];
                                params[0] = 'S';
                                params[1] = "Password Reset";
                                params[2] = "Your password was changed and you were automatically signed in!";
                                gblSetAndOpenMessageBox(params);
                                params = null;

                            } else if ((objSignIn.statCode == 400 || objSignIn.statCode == 500) && objSignIn.infoMsg != null && objSignIn.infoMsg != "") {
                                document.getElementById("gblObjPwdResetMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + objSignIn.statMsg + ' - ' + objSignIn.infoMsg + '&rdquo;</span>';
                            } else {
                                document.getElementById("gblObjPwdResetMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + objSignIn.statMsg + '&rdquo;</span>';
                            }
                        } catch (e) {
                            document.getElementById("gblObjPwdResetMessages").innerHTML = e;
                        }
                        objSignIn = null;
                    }); 

                    email = null;
                    password = null;

                } else if ((obj.statCode == 400 || obj.statCode == 403 || obj.statCode == 500) && obj.infoMsg != null && obj.infoMsg != "") {
                    document.getElementById("gblObjPwdResetMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + ' - ' + obj.infoMsg + '&rdquo;</span>';
                } else {
                    document.getElementById("gblObjPwdResetMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + '&rdquo;</span>';
                }
            } catch (e) {
                document.getElementById("gblObjPwdResetMessages").innerHTML = e;
            }
            obj = null;
        });

        userid = null;
        requestid = null;
        email = null;
        password = null;
        token = null;
    }

}

//Page function to perform Sign Up
function funDoSignUp() {
    if (gblCheckFormForCompletion('gblObjSignUpForm')) {

        objNotice.showLoading({title: 'Signing up...'});

        var firstName = document.getElementById("gblObjSignUpFirstName").value;
        var lastName = document.getElementById("gblObjSignUpLastName").value;
        var email = document.getElementById("gblObjSignUpEmail").value;
        var password = document.getElementById("gblObjSignUpPassword").value;

        gblCreateUserService(firstName, lastName, email, password, function(result) {
            var obj = "";
            try {
                obj = JSON.parse(result);

                if (obj.statCode == 200 && obj.result.userID != null && obj.result.userID != '') {

                    gblAuthenticateUserService(email, password, function (result) {
                        var objSignIn = "";
                        try {
                            objSignIn = JSON.parse(result);

                            if (objSignIn.statCode == 200) {
                                gblSetCookie("userEmail", objSignIn.result.userEmail, 1);
                                gblSetCookie("userID", objSignIn.result.userID, 1);
                                gblSetCookie("authToken", objSignIn.result.authToken, 1);
                                gblSetCookie("userName", objSignIn.result.userName, 1);
                                gblSetCookie("userFirstName", objSignIn.result.firstName, 1);
                                gblSetCookie("userLastName", objSignIn.result.lastName, 1);
                                gblSetCookie("userStatus", objSignIn.result.userStatus, 1);
                                $('#gblObjSignUpBox').modal('hide');
                                funSignInManagement();
                                glbShowHideDiv('gblObjSignUpButton', 0);
                                glbShowHideDiv('gblObjSignInButton', 0);

                                var params = [];
                                params[0] = 'S';
                                params[1] = "Welcome " + objSignIn.result.userName;
                                params[2] = "Your account was created and you were automatically signed in! We sent you a verificationn e-mail. Please check your mailbox.";
                                gblSetAndOpenMessageBox(params);
                                params = null;

                            } else if ((objSignIn.statCode == 400 || objSignIn.statCode == 500) && objSignIn.infoMsg != null && objSignIn.infoMsg != "") {
                                document.getElementById("gblObjSignUpMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + objSignIn.statMsg + ' - ' + objSignIn.infoMsg + '&rdquo;</span>';
                            } else {
                                document.getElementById("gblObjSignUpMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + objSignIn.statMsg + '&rdquo;</span>';
                            }
                        } catch (e) {
                            document.getElementById("gblObjSignUpMessages").innerHTML = e;
                        }
                        objSignIn = null;
                    });
                } else if ((obj.statCode == 400 || obj.statCode == 500) && obj.infoMsg != null && obj.infoMsg != "") {
                    document.getElementById("gblObjSignUpMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + ' - ' + obj.infoMsg + '&rdquo;</span>';
                } else {
                    document.getElementById("gblObjSignUpMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + '&rdquo;</span>';
                }
            } catch (e) {
                document.getElementById("gblObjSignUpMessages").innerHTML = e;
            }
            obj = null;
            objNotice.hideLoading();
        });

    }

}

//Page function to perform Forgot Password
function funDoForgotPassword() {
    if (gblCheckFormForCompletion('gblObjForgotPwdForm')) {

        var email = document.getElementById("gblObjForgotPwdEmail").value;

        gblResetPasswordEmailService(email, function (result) {
            var obj = "";
            try {
                obj = JSON.parse(result);

                if (obj.statCode == 200) {
                    var params = [];
                    params[0] = 'S';
                    params[1] = "Password Reset";
                    params[2] = obj.result;

                    $('#gblObjForgotPwdBox').modal('hide');
                    gblSetAndOpenMessageBox(params);
                    params = null;
                } else if ((obj.statCode == 400 || obj.statCode == 500) && obj.infoMsg != null && obj.infoMsg != "") {
                    document.getElementById("gblObjForgotPwdMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + ' - ' + obj.infoMsg + '&rdquo;</span>';
                } else {
                    document.getElementById("gblObjForgotPwdMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + '&rdquo;</span>';
                }
            } catch (e) {
                document.getElementById("gblObjForgotPwdMessages").innerHTML = e;
            }
        });
    }
}

//Page function to perform Sign In
function funDoSignIn() {

    if (gblCheckFormForCompletion('gblObjSignInForm')) {

        objNotice.showLoading({title: 'Signing in...'});

        var email = document.getElementById("gblObjSignInEmail").value;
        var password = document.getElementById("gblObjSignInPassword").value;
        
        gblAuthenticateUserService(email, password, function (result){
            var obj = "";
            try {
                obj = JSON.parse(result);

                if(obj.statCode == 200) {
                    gblSetCookie("userEmail", obj.result.userEmail, 1);
                    gblSetCookie("userID", obj.result.userID, 1);
                    gblSetCookie("authToken", obj.result.authToken, 1);
                    gblSetCookie("userName", obj.result.userName, 1);
                    gblSetCookie("userFirstName", obj.result.firstName, 1);
                    gblSetCookie("userLastName", obj.result.lastName, 1);
                    gblSetCookie("userStatus", obj.result.userStatus, 1);
                    $('#gblObjSignInpBox').modal('hide');
                    funSignInManagement();
                    glbShowHideDiv('gblObjSignUpButton',0);
                    glbShowHideDiv('gblObjSignInButton', 0);

                } else if ((obj.statCode == 400 || obj.statCode == 500) && obj.infoMsg != null && obj.infoMsg != "") {
                        document.getElementById("gblObjSignInMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + ' - ' + obj.infoMsg + '&rdquo;</span>';
                } else {
                    document.getElementById("gblObjSignInMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + '&rdquo;</span>';
                }
            } catch(e) {
                document.getElementById("gblObjSignInMessages").innerHTML = e;
            }
            obj = null;
            objNotice.hideLoading();
        });
    }
}

//Page function to perform Sign Out
function funDoSignOut() {
    
    objNotice.showLoading({title: 'Signing out...'});
    
    gblSignOutService(glbGetCookie("userID"), function (result) {
        
        var obj = "";
        try {
            obj = JSON.parse(result);
            //console.log(obj.statCode);
        } catch (e) {
            console.log("error: " + e);
        }
        // hide the loading spinner
        objNotice.hideLoading();

        $('#gblObjSignOutBox').modal('hide');
        gblSetCookie("userEmail", '', -1);
        gblSetCookie("authToken", '', -1);
        gblSetCookie("userID", '', -1);
        gblSetCookie("userName", '', -1);
        gblSetCookie("userFirstName", '', -1);
        gblSetCookie("userLastName", '', -1);
        gblSetCookie("userStatus",'', -1);
        funSignInManagement();
    });
}

//Check if the page was loaded via password reset request
function funCheckPasswordReset() {

    var pwdResetReqId = glbGetCookie("pwdResetReqId");
    var pwdResetReqIdStatus = glbGetCookie("pwdResetReqIdStatus");

    if (pwdResetReqIdStatus != "" && pwdResetReqIdStatus == 0) {
        var params = [];

        funOpenMessageBox('W');
    } else if (pwdResetReqIdStatus != "" && pwdResetReqIdStatus == 1) {

        gblCleanUpForm("gblObjPwdResetForm");
        gblRequestDetailService(pwdResetReqId, function (result) {
            var obj = "";
            try {
                obj = JSON.parse(result);
                if (obj.statCode == 200) {
                    document.getElementById("gblObjPwdResetEmail").innerHTML = obj.result.email;
                    document.getElementById("gblObjPwdResetRequestId").value = pwdResetReqId;
                    document.getElementById("gblObjPwdResetUserId").value = obj.result.userid;
                    document.getElementById("gblObjPwdResetMessages").innerHTML = "";
                } else if ((obj.statCode == 400 || obj.statCode == 500) && obj.infoMsg != null && obj.infoMsg != "") {
                    document.getElementById("gblObjPwdResetMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + ' - ' + obj.infoMsg + '&rdquo;</span>';
                } else {
                    document.getElementById("gblObjPwdResetMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + '&rdquo;</span>';
                }
            } catch (e) {
                console.log("error: " + e);
            }
        });
        $('#gblObjPwdResetBox').modal();
    }
    gblSetCookie("pwdResetReqId", '', -1);
    gblSetCookie("pwdResetReqIdStatus", '', -1);

}

//Retrieve login status and update screen
function funSignInManagement() {

    var userId = glbGetCookie("userID");
    var firstName = glbGetCookie("userFirstName");
    var lastName = glbGetCookie("userLastName");
    var authToken = glbGetCookie("authToken");
    var userEmail = glbGetCookie("userEmail");
    var userName = glbGetCookie("userName");
    if (glbGetCookie("userStatus") == 'P') { 
        userStatus = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;User not yet verified. Please activate e-mail verification</span>';
    } else if (glbGetCookie("userStatus") == 'A') {
        userStatus = '<span style="color: black;"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>&nbsp;&nbsp;User verified</span>';
    }

    if (userId != null && authToken != null && userEmail != null && userId != '' && authToken != '' && userEmail != '') {
        //User is logged in
        document.getElementById("lblUserId").innerHTML = userId;
        document.getElementById("lblUserFirstName").innerHTML = firstName;
        document.getElementById("lblUserLastName").innerHTML = lastName;
        document.getElementById("lblEmail").innerHTML = userEmail;
        document.getElementById("lblAuthToken").innerHTML = authToken;
        document.getElementById("lblUserSalutation").innerHTML = "Hello " + userName;
        document.getElementById("lblUserStatus").innerHTML = userStatus;
        
        glbShowHideDiv('gblObjSignUpButton', 0);
        glbShowHideDiv('gblObjSignInButton', 0);
        glbShowHideDiv('gblObjSignOutButton', 1);
  
    } else {
        //User is not logged in
        document.getElementById("lblUserId").innerHTML = "none <i>(user not logged in)</i>";
        document.getElementById("lblUserFirstName").innerHTML = "none <i>(user not logged in)</i>";
        document.getElementById("lblUserLastName").innerHTML = "none <i>(user not logged in)</i>";
        document.getElementById("lblEmail").innerHTML = "none <i>(user not logged in)</i>";
        document.getElementById("lblAuthToken").innerHTML = "none <i>(user not logged in)</i>";
        document.getElementById("lblUserSalutation").innerHTML = "";
        document.getElementById("lblUserStatus").innerHTML = "none <i>(user not logged in)</i>";

        glbShowHideDiv('gblObjSignUpButton', 1);
        glbShowHideDiv('gblObjSignInButton', 1);
        glbShowHideDiv('gblObjSignOutButton', 0);
    }

    var objCntrDeviceList = angular.element($('#controllerDeviceList')).scope();
    objCntrDeviceList.doDisplayUserDevices();
    objCntrDeviceList = null;

    var objCntrSessionList = angular.element($('#controllerSessionList')).scope();
    objCntrSessionList.doDisplayUserSessions();
    objCntrSessionList = null;
}
