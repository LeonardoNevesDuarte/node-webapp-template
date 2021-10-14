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


//Attach event listeners to UI objects
document.getElementById("gblObjSignUpButton").addEventListener("click", function () { gblCleanUpForm('gblObjSignUpForm'); $('#gblObjSignUpBox').modal(); });
document.getElementById("gblObjSignInButton").addEventListener("click", function () { gblCleanUpForm('gblObjSignInpBox'); $('#gblObjSignInpBox').modal(); });
document.getElementById("gblObjSignOutButton").addEventListener("click", function () { $('#gblObjSignOutBox').modal(); });
document.getElementById("gblObjSignInForgotPasswordButton").addEventListener("click", function () { $('#gblObjSignInpBox').modal('hide'); gblCleanUpForm('gblObjForgotPwdForm'); $('#gblObjForgotPwdBox').modal(); });
//document.getElementById("gblObjSignUpTrySignUpButton").addEventListener("click", funDoSignUp);
//document.getElementById("gblObjSignInTrySignInButton").addEventListener("click", funDoSignIn);
document.getElementById("tryChangeBasicDataButton").addEventListener("click", function () { if (gblCheckFormForCompletion('basicDataForm')) { doConfirmUpdate('B')}});
document.getElementById("tryChangeEmailButton").addEventListener("click", function () { if (gblCheckFormForCompletion('emailForm')) {doConfirmUpdate('E')}});
document.getElementById("tryChangePasswordButton").addEventListener("click", function () { if (gblCheckFormForCompletion('passwordForm')) {doConfirmUpdate('P')}});
document.getElementById("tryVerifyAccountButton").addEventListener("click", function () { doConfirmUpdate('V') });

document.getElementById("tryGenerateTokenButton").addEventListener("click", function () {
    const instance = new Notice();

    // show the loading spinner
    instance.showLoading({
        //type: 'line',
        title: 'Working...'
    });

    // hide the loading spinner
    //instance.hideLoading();
 });



//######################################################
//###################  Page functions ##################
//######################################################

//Opens confirmation dialog box for each action
//varConfirmationType (B, E or P) => Basic / E-mail / Password
function doConfirmUpdate(varConfirmationType) {
    
    var params = [];

    switch (varConfirmationType) {
        case 'B':
            params[0] = "Basic Data Change";
            params[1] = "Do you confirm you want to perform this change on your basic data?";
            params[2] = doChangeBasicData;
            break;
        case 'E':
            params[0] = "E-mail Address Change";
            params[1] = "Do you confirm you want to change your e-mail address?";
            params[2] = doChangeEmail;
            break;
        case 'P':
            params[0] = "Password Change";
            params[1] = "Do you confirm you want to change your password?";
            params[2] = doChangePassword;
            break;
        case 'V':
            params[0] = "Account Verification";
            params[1] = "Do you confirm you want to trigger the account verification process? An e-mail will be sent to your mailbox with furthe instructions";
            params[2] = doTriggerAccountVerification;
            break;
    }
    gblSetAndOpenConfirmationBox(params);
    params = null;
}


//Page function to trigger account verification
function doTriggerAccountVerification() {

    $('#gblObjConfirmationBox').modal('hide');
    document.getElementById("tryVerifyAccountButton").disabled = true;

    var userid = document.getElementById("hidBasicDataFormUserID").value;

    gblAccountVerificationService(userid, function (result) {
        var obj = "";
        try {
            obj = JSON.parse(result);

            if (obj.statCode == 200) {
                var params = [];
                params[0] = 'S';
                params[1] = "Account Verification";
                params[2] = obj.result;

                gblSetAndOpenMessageBox(params);
                params = null;

            } else {
                document.getElementById("basicDataFormMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + '&rdquo;</span>';
            }
            document.getElementById("tryVerifyAccountButton").disabled = false;
        } catch (e) {
            document.getElementById("basicDataFormMessages").innerHTML = e;
            document.getElementById("tryVerifyAccountButton").disabled = false;
        }
        obj = null;

    });

    userid = null;
}

//Page function to perform basic data change
function doChangeBasicData() {

    $('#gblObjConfirmationBox').modal('hide');
    document.getElementById("tryChangeBasicDataButton").disabled = true;

    var userid = document.getElementById("hidBasicDataFormUserID").value;
    var firstname = document.getElementById("firstName").value;
    var lastname = document.getElementById("lastName").value;
    
    gblUpdateUserService(userid, firstname, lastname, function(result){
        var obj = "";
        try {
            obj = JSON.parse(result);

            if (obj.statCode == 200) {
                if (obj.result.userUpdated == 1) {
                    document.getElementById("basicDataFormMessages").innerHTML = '<span style="color: black;"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>&nbsp;&nbsp;User data was successfuly updated!</span>';
                    gblSetCookie("userFirstName", document.getElementById("firstName").value, 1);
                    gblSetCookie("userLastName", document.getElementById("lastName").value, 1);
                    funSignInManagement();
                } else {
                    document.getElementById("basicDataFormMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred during the process and the data was not updated. Please try again later</span>';
                } 
            } else {
                document.getElementById("basicDataFormMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + '&rdquo;</span>';
            }
            document.getElementById("tryChangeBasicDataButton").disabled = false;
        } catch (e) {
            document.getElementById("basicDataFormMessages").innerHTML = e;
            document.getElementById("tryChangeBasicDataButton").disabled = false;
        }
        obj = null;

    });
    
    userid = null;
    firstname = null;
    lastname = null;
}

//Page function to perform e-mail address change
function doChangeEmail() {
    
    $('#gblObjConfirmationBox').modal('hide');
    var email = document.getElementById("newEmailAddress").value;
    var userid = document.getElementById("hidEmailFormUserID").value;
    var changeIfPossible = 1;

    document.getElementById("tryChangeEmailButton").disabled = true;

    gblValidateEmailService(userid, email, changeIfPossible, function (result) {
        var obj = "";
        try {
            obj = JSON.parse(result);

            if (obj.statCode == 200) {
                if (obj.result.emailFound == 1) {
                    document.getElementById("emailFormMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;E-mail address was found in the database and cannot be used</span>';
                } else if (obj.result.emailFound == 0 && obj.result.emailUpdate == 1){
                    document.getElementById("emailFormMessages").innerHTML = '<span style="color: black;"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>&nbsp;&nbsp;Your e-mail address was changed successfuly!</span>';
                    gblSetCookie("userEmail", document.getElementById("newEmailAddress").value, 1);
                    funSignInManagement();
                } else {
                    document.getElementById("emailFormMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred and the e-mail address was not changed. Please try again later.</span>';
                }
            } else {
                document.getElementById("emailFormMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + '&rdquo;</span>';
            }
            document.getElementById("tryChangeEmailButton").disabled = false;
        } catch (e) {
            document.getElementById("emailFormMessages").innerHTML = e;
            document.getElementById("tryChangeEmailButton").disabled = false;
        }
        obj = null;
    });
    email = null;
    userid = null;
    changeIfPossible = null;
}

//Page function to perform password change
function doChangePassword() {

    $('#gblObjConfirmationBox').modal('hide');
    document.getElementById("tryChangePasswordButton").disabled = true;

}

function funLocalCallBackForConfirmation() {
    $('#gblObjConfirmationBox').modal('hide');
    //unOpenMessageBox('S');
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

//Page function to perform Sign Out
function funDoSignOut() {

    gblSignOutService(glbGetCookie("userID"), function (result) {
        var obj = "";
        try {
            obj = JSON.parse(result);
            //console.log(obj.statCode);
        } catch (e) {
            console.log("error: " + e);
        }
    });

    $('#gblObjSignOutBox').modal('hide');
    gblSetCookie("userEmail", '', -1);
    gblSetCookie("authToken", '', -1);
    gblSetCookie("userID", '', -1);
    gblSetCookie("userName", '', -1);
    gblSetCookie("userFirstName", '', -1);
    gblSetCookie("userLastName", '', -1);
    gblSetCookie("userStatus",'', -1);
    funSignInManagement();
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
        userStatus = '<span style="color: rgba(201, 48,44, 0.8);" class="fSize12"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;User not yet verified. Please activate e-mail verification</span>';
    } else if (glbGetCookie("userStatus") == 'A') {
        userStatus = '<span style="color: black;" class="fSize12"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>&nbsp;&nbsp;User verified</span>';
    }

    if (userId != null && authToken != null && userEmail != null && userId != '' && authToken != '' && userEmail != '') {
        //User is logged in
        document.getElementById("hidBasicDataFormUserID").value = userId;
        document.getElementById("hidEmailFormUserID").value = userId;
        document.getElementById("hidPasswordFormUserID").value = userId;
        document.getElementById("firstName").value = firstName;
        document.getElementById("lastName").value = lastName;
        document.getElementById("currentEmailAddress").innerHTML = userEmail;
        document.getElementById("newEmailAddress").value = userEmail;
        document.getElementById("lblUserSalutation").innerHTML = "Hello " + userName;
        document.getElementById("userStatus").innerHTML = userStatus;
        
        glbShowHideDiv('gblObjSignUpButton', 0);
        glbShowHideDiv('gblObjSignInButton', 0);
        glbShowHideDiv('gblObjSignOutButton', 1);
  
    } else {
        //User is not logged in
        glbShowHideDiv('gblObjSignUpButton', 1);
        glbShowHideDiv('gblObjSignInButton', 1);
        glbShowHideDiv('gblObjSignOutButton', 0);
    }

    
    var objCntrDeviceList = angular.element($('#controllerDeviceList')).scope();
    objCntrDeviceList.doDisplayUserDevices();
    objCntrDeviceList = null;

    /*
    var objCntrSessionList = angular.element($('#controllerSessionList')).scope();
    objCntrSessionList.doDisplayUserSessions();
    objCntrSessionList = null;
    */
}
