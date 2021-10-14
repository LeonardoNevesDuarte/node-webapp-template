//#####################################################################
//###################  Common Operations Functions  ###################
//#####################################################################

//Page function to perform Sign In
function funDoSignIn() {

    if (gblCheckFormForCompletion('gblObjSignInForm')) {

        objNotice.showLoading({ title: 'Signing in...' });

        var email = document.getElementById("gblObjSignInEmail").value;
        var password = document.getElementById("gblObjSignInPassword").value;

        gblAuthenticateUserService(email, password, function (result) {
            var obj = "";
            try {
                obj = JSON.parse(result);

                if (obj.statCode == 200) {
                    gblSetCookie("userEmail", obj.result.userEmail, 1);
                    gblSetCookie("userID", obj.result.userID, 1);
                    gblSetCookie("authToken", obj.result.authToken, 1);
                    gblSetCookie("userName", obj.result.userName, 1);
                    gblSetCookie("userFirstName", obj.result.firstName, 1);
                    gblSetCookie("userLastName", obj.result.lastName, 1);
                    gblSetCookie("userStatus", obj.result.userStatus, 1);
                    $('#gblObjSignInpBox').modal('hide');
                    funSignInManagement(gblSignInManagement());

                } else if ((obj.statCode == 400 || obj.statCode == 500) && obj.infoMsg != null && obj.infoMsg != "") {
                    document.getElementById("gblObjSignInMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + ' - ' + obj.infoMsg + '&rdquo;</span>';
                } else {
                    document.getElementById("gblObjSignInMessages").innerHTML = '<span style="color: rgba(201, 48,44, 0.8);"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp;&nbsp;An error has occurred: &ldquo;' + obj.statMsg + '&rdquo;</span>';
                }
            } catch (e) {
                document.getElementById("gblObjSignInMessages").innerHTML = e;
            }
            obj = null;
            objNotice.hideLoading();
        });
    }
}
//Page function to perform Sign Up
function funDoSignUp() {
    if (gblCheckFormForCompletion('gblObjSignUpForm')) {

        objNotice.showLoading({ title: 'Signing up...' });

        var firstName = document.getElementById("gblObjSignUpFirstName").value;
        var lastName = document.getElementById("gblObjSignUpLastName").value;
        var email = document.getElementById("gblObjSignUpEmail").value;
        var password = document.getElementById("gblObjSignUpPassword").value;

        gblCreateUserService(firstName, lastName, email, password, function (result) {
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
                                funSignInManagement(gblSignInManagement());
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
//Page function to perform Sign Out
function funDoSignOut() {

    objNotice.showLoading({ title: 'Signing out...' });

    gblSignOutService(glbGetCookie("userID"), function (result) {

        var obj = "";
        try {
            obj = JSON.parse(result);
            //console.log(obj.statCode);
        } catch (e) {
            console.log("error: " + e);
        }
        $('#gblObjSignOutBox').modal('hide');
        gblSetCookie("userEmail", '', -1);
        gblSetCookie("authToken", '', -1);
        gblSetCookie("userID", '', -1);
        gblSetCookie("userName", '', -1);
        gblSetCookie("userFirstName", '', -1);
        gblSetCookie("userLastName", '', -1);
        gblSetCookie("userStatus", '', -1);
        funSignInManagement(gblSignInManagement());

        // hide the loading spinner
        objNotice.hideLoading();
    });
}
