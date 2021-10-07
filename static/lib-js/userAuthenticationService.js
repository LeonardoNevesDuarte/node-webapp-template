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

function gblResetPasswordService(varEmail, callbackFunction) {
    try {
        var httpHandle = gblCreateHTTPObj();

        var params = [
            { param_name: "email", param_value: varEmail }
        ];
        gblDoHTTPRequest(httpHandle, 'httpHandle', params, "/api/doPwdReset", "", callbackFunction);
    } catch (e) {
        console.log(e);
    }
}

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
