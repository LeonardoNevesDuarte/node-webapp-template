
function gblCreateHTTPObj() {

	var varObj = null;

	try {
		varObj = new ActiveXObject("Microsoft.XMLHTTP");
		//console.log("Atribuindo ActiveXObject - Microsoft.XMLHTTP");
	} catch(e) {
		try {
			varObj = new ActiveXObject("Msxml2.XMLHTTP");
			//console.log("Atribuindo ActiveXObject - Msxml2.XMLHTTP");
		} catch(ex) {
			try {
				varObj = new XMLHttpRequest();
				//console.log("Atribuindo XMLHttpRequest");
			} catch(exc) {
				varObj = null;
			}	
		}
	}
	return varObj;
}

function gblDoHTTPRequest(obj, objName, objParams, url, objInfoPanel, callbackFunction) {

    obj.onreadystatechange = function() {
        
        if(obj.readyState == 1) {
            //console.log(objName+": Em execucao");
        	if(objInfoPanel != null) {
        		glbShowHideDiv(objInfoPanel, 1);
        	}
        }
        if(obj.readyState == 4 ) {
            if(obj.responseText) {

                //console.log(objName+": Execucao da chamada remota executada com sucesso");
                if (callbackFunction != null) {
                    callbackFunction(obj.responseText);
				} else {
					//console.log(obj.responseText);
					return(obj.responseText);
				}
				if(objInfoPanel != null) {
					glbShowHideDiv(objInfoPanel, 0);
				}
            } else {
                //console.log(objName+": Erro na execucao");
            	if(objInfoPanel != null) {
            		glbShowHideDiv(objInfoPanel, 0);
				}		
            }
        }
    }

	var params = "{ ";
	var paramsSep = ""; 

	for(var i = 0; i < objParams.length; i++) {
        params = params + paramsSep + '"' + objParams[i]["param_name"] + '"' + ':' + '"' + objParams[i]["param_value"] + '"';
		paramsSep = ",";	
        
	}
    params = params + " }";
	i = null;
	paramsSep = null;

    obj.open("POST", url, true);
    //obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    obj.setRequestHeader("Content-type", "application/json");
    obj.send(params);
    params = null;

}