/*!
 * Webfingers Util
 */
//Check if value is a valid email
function wfIsEmail(varData) {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(varData);
}

//Check if key value is valid for alpha only fields
function gblIsAlphaKey(evt) {
    
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if ((charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90)) {
        return true;
    } else {
        evt.preventDefault();
        return false;
    }
}

//Check if key value is a valid number
function gblIsNumericKey(evt){
    
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode >= 48 && charCode <= 57) {
        return true;
    } else {
        evt.preventDefault();
        return false;
    }
}

//Check if key value is a valid number
function gblIsAlphaNumericKey(evt) {

    var charCode = (evt.which) ? evt.which : event.keyCode
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90)) {
        return true;
    } else {
        evt.preventDefault();
        return false;
    }
}

//Check if key value is a valid number
function gblIsAlphaNumericSymbolKey(evt) {

    //33 - !
    //35 - #
    //36 - $
    //42 - *
    //44 - ,
    //45 - -
    //46 - .
    //59 - ;
    //64 - @
    //95 - _

    var charCode = (evt.which) ? evt.which : event.keyCode
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90) || 
        charCode == 64 || charCode == 44 || charCode == 59 || charCode == 45 || charCode == 46 || charCode == 95 || charCode == 35 || 
        charCode == 36 || charCode == 42 || charCode == 33)  {
        return true;
    } else {
        evt.preventDefault();
        return false;
    }
}


//Check if key value is a valid number
function gblIsEmailKey(evt) {

    var charCode = (evt.which) ? evt.which : event.keyCode
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90) || charCode == 64 || charCode == 45 || charCode == 46 || charCode == 95) {
        return true;
    } else {
        evt.preventDefault();
        return false;
    }
}

//Check if key value is valid for float number
function wfIsFloatKey(evt){
    
	//44 = ,
	//46 = .
	var charCode = (evt.which) ? evt.which : event.keyCode
    		if (charCode > 31 && (charCode != 44 && (charCode < 48 || charCode > 57)))
        return false;
    return true;
}

function fadeIn(el, time) {
  el.style.opacity = 0;

  var last = +new Date();
  var tick = function() {
    el.style.opacity = +el.style.opacity + (new Date() - last) / time;
    last = +new Date();

    if (+el.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    }
  };

  tick();
}

function funFade(el, type, time) {
	
	if(type == "IN") {
		el.style.opacity = 0;
	} else { // OUT
		el.style.opacity = 1;
	}
	
	var last = +new Date();
	var tick = function() {
	
		if(type == "IN") {
			el.style.display = '';
			el.style.opacity = +el.style.opacity + (new Date() - last) / time;
		    last = +new Date();
		
		    if (+el.style.opacity < 1) {
		    	  //console.log(el.style.opacity);
			      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
			}
		    
		} else if (type == "OUT") {
			
			el.style.opacity = +el.style.opacity - (new Date() - last) / time;
		    last = +new Date();
		
		    if (+el.style.opacity > 0) {
		    	  //console.log(el.style.opacity);
			      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
			} else {
				el.style.display = 'none';
			}
			
		}

	};
	
	tick();
}

function glbShowHideDiv(id, method) {

	//method 1 = show, 0 = hide
	obj = document.getElementById(id);

	if(obj != null) { 
		if (method == 1) {
			obj.style.display = 'inline';
		} else {
			obj.style.display = 'none';
		} 
	}	
	obj = null;
}

//Get cookie by its name
function glbGetCookie(cname) {
	  var name = cname + "=";
	  var decodedCookie = decodeURIComponent(document.cookie);
	  var ca = decodedCookie.split(';');
	  for(var i = 0; i <ca.length; i++) {
	    var c = ca[i];
	    while (c.charAt(0) == ' ') {
	      c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
	      return c.substring(name.length, c.length);
	    }
	  }
	  return "";
}
//Set a cookie
function gblSetCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + "; path=/";
}

//Get custom parameters from custom classNames
//Used by form completion check (gblCheckFormForCompletion)
function gblGetCustomParameterFromClassSubClass(varFullClassName, varTargetClassName) {

    var posStartElementClass = varFullClassName.search(varTargetClassName);
    var posEndElementClass = varFullClassName.indexOf(' ', posStartElementClass);

    if (posEndElementClass > posStartElementClass) {
        var elementSubClassName = varFullClassName.substring(posStartElementClass, posEndElementClass);
    } else if (posEndElementClass < 0) {
        var elementSubClassName = varFullClassName.substring(posStartElementClass, varFullClassName.length);
    }

    var result = elementSubClassName.substring(varTargetClassName.length, elementSubClassName.length);
    posStartElementClass = null;
    posEndElementClass = null;
    elementSubClassName = null;

    return result;
}

//Check mandatory fields based on the dummy class 'clsMandatoryField'
//In case of a blank field, a tooltip is raised and then destroyed
//Check min length of fields based on clsMinLength and clsMinLength-X custom class
//Check value cross-reference of fields based on clsEquals and clsEquals-X custom class
function gblCheckFormForCompletion(varForm) {

    var formObj = document.getElementById(varForm);
    var lstMandatoryFields = formObj.getElementsByClassName("clsMandatoryField");
    var lstMinLengthFields = formObj.getElementsByClassName("clsMinLength");
    var lstEqualsFields = formObj.getElementsByClassName("clsEquals");
    var lstEmailFields = formObj.getElementsByClassName("clsEmail");
    var blnMandatoryOk = true;
    var blnLengthOk = true;
    var result = true;

    for (var i = 0; i < lstMandatoryFields.length; i++) {

        if (lstMandatoryFields[i].value == '') {
            lstMandatoryFields[i].title = "This is a mandatory field";
            $('#' + lstMandatoryFields[i].id).tooltip('show');
            gblDestroyTooltip('#' + lstMandatoryFields[i].id, 2000);
            result = false;
            blnMandatoryOk = false;
        } else {
            lstMandatoryFields[i].title = '';
        }
    }

    //Check of length and cross-reference must be done only if all mandatory fields are completed
    if (blnMandatoryOk) {

        for (var i = 0; i < lstMinLengthFields.length; i++) {

            var elementLength = gblGetCustomParameterFromClassSubClass(lstMinLengthFields[i].className, 'clsMinLength-');

            if (lstMinLengthFields[i].value.length < elementLength) {
                blnLengthOk = false;
                lstMinLengthFields[i].title = "This element must have at least "+ elementLength + " characters";
                $('#' + lstMinLengthFields[i].id).tooltip('show');
                gblDestroyTooltip('#' + lstMinLengthFields[i].id, 4000);
                result = false;
            } else {
                lstMinLengthFields[i].title = '';
            }
            elementLength = null;
        }
        i = null;

        if (blnLengthOk) {
            for (var i = 0; i < lstEqualsFields.length; i++) {

                var elementToCompare = gblGetCustomParameterFromClassSubClass(lstEqualsFields[i].className, 'clsEquals-');

                if (lstEqualsFields[i].value != document.getElementById(elementToCompare).value) {
                    lstEqualsFields[i].title = "This value must be equal to field " + lstEqualsFields[i].dataset.compare;
                    $('#' + lstEqualsFields[i].id).tooltip('show');
                    gblDestroyTooltip('#' + lstEqualsFields[i].id, 4000);
                    result = false;
                } else {
                    lstEqualsFields[i].title = '';
                }
                elementToCompare = null;
            }
            i = null;
        }
        if (result) {
            for (var i = 0; i < lstEmailFields.length; i++) {

                if (!wfIsEmail(lstEmailFields[i].value)) {
                    lstEmailFields[i].title = "E-mail address not valid";
                    $('#' + lstEmailFields[i].id).tooltip('show');
                    gblDestroyTooltip('#' + lstEmailFields[i].id, 2000);
                    result = false;
                } else {
                    lstEmailFields[i].title = '';
                }
            }
            i = null;
        }
    }

    lstMandatoryFields = null;
    lstMinLengthFields = null;
    lstEqualsFields = null;
    lstEmailFields = null;
    blnMandatoryOk = null;
    blnLengthOk = null;

    formObj = null;
    return result;
}

//Destroy a tooltip according to a timer
function gblDestroyTooltip(varElement, varTimeOut) {
    setTimeout(function () {
        $(varElement).tooltip('destroy');
    }, varTimeOut);
}

//Set message details and open custom message box
function gblSetAndOpenMessageBox(varParams) {
    document.getElementById("gblObjMessageBoxTitle").innerHTML = varParams[1];
    document.getElementById("gblObjMessageBoxMessage").innerHTML = varParams[2];

    if(varParams[0] == 'E') {
        document.getElementById("gblObjMessageBoxIcon").className = "glyphicon glyphicon-alert";
        document.getElementById("gblObjMessageBoxHeader").style.background = "rgba(201, 48,44, 0.8)";
        document.getElementById("gblObjMessageBoxIcon").style.color = "rgba(201, 48,44, 0.8)";
        document.getElementById("gblObjMessageBoxHeader").style.color = "#fff";
    } else if (varParams[0] == 'W') {
        document.getElementById("gblObjMessageBoxIcon").className = "glyphicon glyphicon-exclamation-sign";
        document.getElementById("gblObjMessageBoxHeader").style.background = "rgba(240, 173, 78, 0.8)";
        document.getElementById("gblObjMessageBoxIcon").style.color = "rgba(240, 173, 78, 0.8)";
        document.getElementById("gblObjMessageBoxHeader").style.color = "#fff";
    } if (varParams[0] == 'S') {
        document.getElementById("gblObjMessageBoxIcon").className = "glyphicon glyphicon-ok-sign";
        document.getElementById("gblObjMessageBoxHeader").style.background = "rgba(92, 184, 92, 0.8)";
        document.getElementById("gblObjMessageBoxIcon").style.color = "rgba(92, 184, 92, 0.8)";
        document.getElementById("gblObjMessageBoxHeader").style.color = "#fff";
    }

    $('#gblObjMessageBox').modal();
}

//Set message details and open confirmation message box
function gblSetAndOpenConfirmationBox(varParams) {
    document.getElementById("gblObjConfirmationBoxTitle").innerHTML = varParams[0];
    document.getElementById("gblObjConfirmationBoxMessage").innerHTML = varParams[1];
    document.getElementById("gblObjConfirmationBoxButton").addEventListener("click", varParams[2]);
    $('#gblObjConfirmationBox').modal();
}

//CleanUp Forms based on classNames
//Applicable to clsFields
function gblCleanUpForm(varForm) {

    var formObj = document.getElementById(varForm);
    var lstFields = formObj.getElementsByClassName("clsFields");
    var result = true;

    for (var i = 0; i < lstFields.length; i++) {
        if (lstFields[i].nodeName == "INPUT") {
            lstFields[i].value = '';
        }
        if (lstFields[i].nodeName == "P") {
            lstFields[i].innerHTML = '';
        }
    }
    formObj = null;
    return result;
}


//Attach validation rules to keypress events based on classNames
//Applicable to: 
//clsAlpha => (a to z / A to Z)
//clsEmail =>  (a to z / A to Z / 0 to 9 / @ . - _)
//clsAlphaNumeric => (a to z / A to Z / 0 to 9)
//clsAlphaNumericSymbol => (a to z / A to Z / 0 to 9 / ! @ # $ - . _)
//clsFloat
//clsNumeric => (0 to 9)

function gblAttachValidationRulesForKeyPress() {

    var lstFieldsAlpha = document.getElementsByClassName("clsAlpha");
    var lstFieldsAlphaNumeric = document.getElementsByClassName("clsAlphaNumeric");
    var lstFieldsNumeric = document.getElementsByClassName("clsNumeric");
    var lstFieldsAlphaNumericSymbol = document.getElementsByClassName("clsAlphaNumericSymbol");
    var lstFieldsEmail = document.getElementsByClassName("clsEmail");
   
    for (var i = 0; i < lstFieldsAlpha.length; i++) {

        //console.log("clsAlpha: " + lstFieldsAlpha[i].id);
        if (lstFieldsAlpha[i].nodeName == "INPUT") {
            //Attach event
            document.getElementById(lstFieldsAlpha[i].id).addEventListener("keypress", function () { gblIsAlphaKey(event); });
        }
    } 
    i = null;

    for (var i = 0; i < lstFieldsAlphaNumeric.length; i++) {

        //console.log("clsAlphaNumeric: " + lstFieldsAlphaNumeric[i].id);
        if (lstFieldsAlphaNumeric[i].nodeName == "INPUT") {
            //Attach event
            document.getElementById(lstFieldsAlphaNumeric[i].id).addEventListener("keypress", function () { gblIsAlphaNumericKey(event); });
        }
    }
    i = null;

    for (var i = 0; i < lstFieldsNumeric.length; i++) {

        //console.log("clsNumeric: " + lstFieldsNumeric[i].id);
        if (lstFieldsNumeric[i].nodeName == "INPUT") {
            //Attach event
            document.getElementById(lstFieldsNumeric[i].id).addEventListener("keypress", function () { gblIsNumericKey(event); });
        }
    }
    i = null;

    for (var i = 0; i < lstFieldsAlphaNumericSymbol.length; i++) {

        //console.log("clsAlphaNumericSymbol: " + lstFieldsAlphaNumericSymbol[i].id);
        if (lstFieldsAlphaNumericSymbol[i].nodeName == "INPUT") {
            //Attach event
            document.getElementById(lstFieldsAlphaNumericSymbol[i].id).addEventListener("keypress", function () { gblIsAlphaNumericSymbolKey(event); });
        }
    }
    i = null;

    for (var i = 0; i < lstFieldsEmail.length; i++) {

        //console.log("clsEmail: " + lstFieldsEmail[i].id);
        if (lstFieldsEmail[i].nodeName == "INPUT") {
            //Attach event
            document.getElementById(lstFieldsEmail[i].id).addEventListener("keypress", function () { gblIsEmailKey(event); });
        }
    }
    i = null;

    lstFieldsAlpha = null;
    lstFieldsAlphaNumeric = null;
    lstFieldsNumeric = null;
    lstFieldsAlphaNumericSymbol = null;
    lstFieldsEmail = null;
}
//Set global UI parameters/objects according to sign in condition
//Returns an array with user basic data
function gblSignInManagement() {

    var userId = glbGetCookie("userID");
    var firstName = glbGetCookie("userFirstName");
    var lastName = glbGetCookie("userLastName");
    var authToken = glbGetCookie("authToken");
    var userEmail = glbGetCookie("userEmail");
    var userName = glbGetCookie("userName");
    var userStatus = glbGetCookie("userStatus");
   
    if (userId != null && authToken != null && userEmail != null && userId != '' && authToken != '' && userEmail != '') {
        //User is logged in
        glbShowHideDiv('gblObjSignUpButton', 0);
        glbShowHideDiv('gblObjSignInButton', 0);
        glbShowHideDiv('gblObjSignOutButton', 1);
        return [userId, firstName, lastName, userEmail, userName, userStatus, authToken];

    } else {
        //User is not logged in
        glbShowHideDiv('gblObjSignUpButton', 1);
        glbShowHideDiv('gblObjSignInButton', 1);
        glbShowHideDiv('gblObjSignOutButton', 0);
        return ['', '', '', '', '', '', ''];
    }
    
}
