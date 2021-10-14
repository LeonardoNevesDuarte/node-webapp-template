//Global function to create a new user account
function gblCreateUserService(varFistName, varLastName, varEmail, varPassword, callbackFunction) {
    try {
        var httpHandle = gblCreateHTTPObj();

        var params = [
            { param_name: "firstname", param_value: varFistName },
            { param_name: "lastname", param_value: varLastName },
            { param_name: "email", param_value: varEmail },
            { param_name: "password", param_value: varPassword }
        ];
        gblDoHTTPRequest(httpHandle, 'httpHandle', params, "/api/doCreateUser", "", callbackFunction);
    } catch (e) {
        console.log(e);
    }
}
//Global function to check if a e-mail address already exist in the database
function gblValidateEmailService(varUserId, varEmail, varChangeIfPossible, callbackFunction) {
    try {
        var httpHandle = gblCreateHTTPObj();

        var params = [
            { param_name: "userid", param_value: varUserId },
            { param_name: "email", param_value: varEmail },
            { param_name: "changeifpossible", param_value: varChangeIfPossible }
        ];
        gblDoHTTPRequest(httpHandle, 'httpHandle', params, "/api/doValidateEmail", "", callbackFunction);
    } catch (e) {
        console.log(e);
    }
}
//Global function to trigger the account verification process
function gblAccountVerificationService(varUserId, callbackFunction) {
    try {
        var httpHandle = gblCreateHTTPObj();

        var params = [
            { param_name: "userid", param_value: varUserId }
        ];
        gblDoHTTPRequest(httpHandle, 'httpHandle', params, "/api/doSendAccountVerificationEmail", "", callbackFunction);
    } catch (e) {
        console.log(e);
    }
}
//Global function to update user password
function gblUpdateUserPasswordService(varEmail, varPassword, callbackFunction) {
    try {
        var httpHandle = gblCreateHTTPObj();

        var params = [
            { param_name: "email", param_value: varEmail },
            { param_name: "password", param_value: varPassword }
        ];
        gblDoHTTPRequest(httpHandle, 'httpHandle', params, "/api/doUpdateUserPassword", "", callbackFunction);
    } catch (e) {
        console.log(e);
    }
}
//Global function to update user data
function gblUpdateUserService(varUserId, varFistName, varLastName,  callbackFunction) {
    try {
        var httpHandle = gblCreateHTTPObj();

        var params = [
            { param_name: "userid", param_value: varUserId },
            { param_name: "firstname", param_value: varFistName },
            { param_name: "lastname", param_value: varLastName }
        ];
        gblDoHTTPRequest(httpHandle, 'httpHandle', params, "/api/doUpdateUser", "", callbackFunction);
    } catch (e) {
        console.log(e);
    }
}