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

function gblUpdateUserService(varFistName, varLastName, varEmail, varPassword, callbackFunction) {
    try {
        var httpHandle = gblCreateHTTPObj();

        var params = [
            { param_name: "firstname", param_value: varFistName },
            { param_name: "lastname", param_value: varLastName },
            { param_name: "email", param_value: varEmail },
            { param_name: "password", param_value: varPassword }
        ];
        //gblDoHTTPRequest(httpHandle, 'httpHandle', params, "/api/doUpdateUser", "", callbackFunction);
    } catch (e) {
        console.log(e);
    }
}