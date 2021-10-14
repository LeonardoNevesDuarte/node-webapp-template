const objStdMessages = require('../include/std_messages_api');
const objUtil = require('../include/wfUtils4Node');
const { authenticate } = require('ldap-authentication');
var nconf = require('nconf');

nconf.file({ file: './config/webapp-template-config.json' });

var ldapReferences = [];

ldapReferences[0] = nconf.get('app_ldap:url');
ldapReferences[1] = nconf.get('app_ldap:port');
ldapReferences[2] = nconf.get('app_ldap:baseDN');
ldapReferences[3] = nconf.get('app_ldap:groupSearchBase');
ldapReferences[4] = nconf.get('app_ldap:groupRestricAccess');
ldapReferences[5] = nconf.get('app_ldap:userField');
ldapReferences[6] = nconf.get('app_ldap:adminLDAPUser');
ldapReferences[7] = nconf.get('app_ldap:adminPassword');
ldapReferences[8] = nconf.get('app_ldap:adminLDAPGroup');

var funCheckUserExist = async function (email) {

    try {
        let options = {
            ldapOpts: {
                url: ldapReferences[0],
                // tlsOptions: { rejectUnauthorized: false }
            },
            adminDn: ldapReferences[5] + '=' + ldapReferences[6] + ',' + ldapReferences[2],
            adminPassword: ldapReferences[7],
            verifyUserExists: true,
            userSearchBase: ldapReferences[2],
            usernameAttribute: 'mail',
            username: email
            // starttls: false
        }
        let user = await authenticate(options);

        if(user != null && user != undefined) {
            //console.log(user.uid);
            return user.uid;
        } else {
            return '';
        }
        user = null;
    } catch (error) {
        console.log(error);
        return '';
    }
}

var funCheckPassword = async function (userEmail, userPassword) {

    var blnRestricAccessToGroup = false;
    var blnUserOK = false;

    if (ldapReferences[4] != null && ldapReferences[4]!= '') {
        blnRestricAccessToGroup = true;
    }

    try {
        
        let userID = await funCheckUserExist(userEmail);

        if(userID != '') {

            let options = {
                ldapOpts: {
                    url: ldapReferences[0],
                    // tlsOptions: { rejectUnauthorized: false }
                },
                userDn: ldapReferences[5] + '=' + userID + ',' + ldapReferences[2],
                userPassword: userPassword,
                userSearchBase: ldapReferences[2],
                usernameAttribute: ldapReferences[5],
                username: userID
                // starttls: false
            }

            let loggedUser = await authenticate(options);

            if (blnRestricAccessToGroup) {
                if (loggedUser.memberOf.length > 0) {
                    for (var i = 0; i < loggedUser.memberOf.length; i++) {
                        //console.log(String(user.memberOf[i]).search(ldapReferences[4]));
                        if (String(loggedUser.memberOf[i]).search(ldapReferences[4]) >= 0) {
                            blnUserOK = true;
                            break;
                        }
                    }
                }
            }
            if (blnUserOK) {
                return JSON.parse(objStdMessages.stdMessages[0].replace('__RESULT__', JSON.stringify(loggedUser)));
            } else {
                return JSON.parse(objStdMessages.stdMessages[5].replace('__RESULT__', '"User authenticated but restricted by group policy"'));
            }
            loggedUser = null;
        } else {
            return JSON.parse(objStdMessages.stdMessages[5].replace('__RESULT__', '"User not found in LDAP"'));
        }
        userID = null;
    } catch(error) {      
        if (String(error.message) == 'Invalid Credentials') {
            console.log(error);
            return JSON.parse(objStdMessages.stdMessages[5].replace('__RESULT__', '"Invalid Credentials"'));
        } else {
            console.log(error);
            return JSON.parse(objStdMessages.stdMessages[1].replace('__RESULT__', '"Please check back-end logs: ' + error.message + '"'));
        }
    }
}


module.exports = {
    doAuthenticate: funCheckPassword
}