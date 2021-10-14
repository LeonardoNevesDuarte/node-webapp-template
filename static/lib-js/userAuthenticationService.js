//#######################################################
//########  Authentication Service - Sign In  ###########
//#######################################################
function gblAuthenticateUserService(varEmail, varPassword, callbackFunction) {
    try {
        var httpHandle = gblCreateHTTPObj();
        var params = [
            { param_name: "email", param_value: varEmail },
            { param_name: "password", param_value: varPassword }
        ];
        gblDoHTTPRequest(httpHandle, 'httpHandle', params, "/api/doLogin", "", callbackFunction);       
    } catch (e) {
        console.log(e);
    }
}
//##########################################################################
//########  Authentication Service - Send Reset Password E-mail  ###########
//##########################################################################
function gblResetPasswordEmailService(varEmail, callbackFunction) {
    try {
        var httpHandle = gblCreateHTTPObj();
        var params = [
            { param_name: "email", param_value: varEmail }
        ];
        gblDoHTTPRequest(httpHandle, 'httpHandle', params, "/api/doSendPasswordResetEmail", "", callbackFunction);
    } catch (e) {
        console.log(e);
    }
}
//#####################################################################
//########  Authentication Service - Fetch Request Details  ###########
//#####################################################################
function gblRequestDetailService(varRequestId, callbackFunction) {
    try {
        var httpHandle = gblCreateHTTPObj();
        var params = [
            { param_name: "requestid", param_value: varRequestId }
        ];
        gblDoHTTPRequest(httpHandle, 'httpHandle', params, "/api/doFetchRequestDetails", "", callbackFunction);
    } catch (e) {
        console.log(e);
    }
}
//###################################################################
//########  Authentication Service - Reset User Password  ###########
//###################################################################
function gblResetPasswordService(varUserID, varPassword, varRequestId, varToken, varEmail, callbackFunction) {
    try {
        var httpHandle = gblCreateHTTPObj();
        var params = [
            { param_name: "userid", param_value: varUserID },
            { param_name: "password", param_value: varPassword },
            { param_name: "requestid", param_value: varRequestId },
            { param_name: "token", param_value: varToken }
        ];
        gblDoHTTPRequest(httpHandle, 'httpHandle', params, "/api/doResetPassword", "", callbackFunction);
    } catch (e) {
        console.log(e);
    }
}
//########################################################
//########  Authentication Service - Sign Out  ###########
//########################################################
function gblSignOutService(varUserID, callbackFunction) {
    try {
        var httpHandle = gblCreateHTTPObj();
        var params = [
            { param_name: "userid", param_value: varUserID },
        ];
        gblDoHTTPRequest(httpHandle, 'httpHandle', params, "/api/doLogoff", "", callbackFunction);       
    } catch (e) {
        console.log(e);
    }
}