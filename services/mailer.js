var nodemailer = require('nodemailer');
var nconf = require('nconf');

nconf.file({ file: './config/webapp-template-config.json' });

const newAccountVerificationMailBodyHTML =
'<html><head><!-- Yahoo App Android will strip this --></head><head><style>' +
'body { text-align: center; background-color: #f6fafb; padding-top: 30px; padding-bottom: 30px; padding-left: 15px; padding-right: 15px; font-size: 16px; line-height: 1.8;} ' +
'.btn { box-shadow:inset 0px 1px 0px 0px #ffffff; background: linear-gradient(to bottom, #f9f9f9 5 %, #e9e9e9 100 %);background-color:#f9f9f9; border-radius: 6px; border: 1px solid #dcdcdc; display: inline-block; cursor: pointer; color:#666666; font-family: Arial; font-size: 15px;font-weight: bold; padding: 6px 24px; text-decoration: none; text-shadow: 0px 1px 0px #ffffff;}' +
'.btn:hover { background: linear-gradient(to bottom, #e9e9e9 5 %, #f9f9f9 100 %); background-color:#e9e9e9; } .btn:active { position: relative; top: 1px;}' +
'</style></head>' +
'<body>' +
'<table width="100%" style="background-color: #fff; padding: 5px;">' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 20px 20px 20px 20px; text-align: center; font-size: 16px;"><img src="http://localhost:2509/img/generic-company-logo.png" width="300"></td></tr>' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 10px 20px 10px 20px; font-size: 16px;"><b>Welcome __EMAIL__!</b></td></tr>' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 10px 20px 8px 20px;">Thank you for signing up for node-webapp-template.</td></tr>' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 0px 20px 10px 20px;">Please proceed with your account verification by clicking the link below.</td></tr>' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 10px 20px 10px 20px;"><a href="http://localhost:2509/email/doAccountVerificationRequest/__REQUEST__" class="btn">Click Here</a></td></tr>' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 10px 20px 8px 20px;">Please note that unverified accounts are automatically deleted in 10 days after sign up</td></tr>' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 0px 20px 10px 20px;">This request will expire in 5 minutes.</td></tr>' +
'<tr><td style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif; padding: 20px 20px 30px 20px;"><b>Yours, node-webapp-template Team</b><br>support@node-webapp-template</td></tr>' +
'</table></body></html>';

const pwdResetMailBodyHTML =
'<html><head><!-- Yahoo App Android will strip this --></head><head><style>' +
'body { text-align: center; background-color: #f6fafb; padding-top: 30px; padding-bottom: 30px; padding-left: 15px; padding-right: 15px; font-size: 16px; line-height: 1.8;} ' + 
'.btn { box-shadow:inset 0px 1px 0px 0px #ffffff; background: linear-gradient(to bottom, #f9f9f9 5 %, #e9e9e9 100 %);background-color:#f9f9f9; border-radius: 6px; border: 1px solid #dcdcdc; display: inline-block; cursor: pointer; color:#666666; font-family: Arial; font-size: 15px;font-weight: bold; padding: 6px 24px; text-decoration: none; text-shadow: 0px 1px 0px #ffffff;}' +
'.btn:hover { background: linear-gradient(to bottom, #e9e9e9 5 %, #f9f9f9 100 %); background-color:#e9e9e9; } .btn:active { position: relative; top: 1px;}' +
'</style></head>' + 
'<body>' +
'<table width="100%" style="background-color: #fff; padding: 5px;">' + 
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 20px 20px 20px 20px; text-align: center; font-size: 16px;"><img src="http://localhost:2509/img/generic-company-logo.png" width="300"></td></tr>' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 10px 20px 10px 20px; font-size: 16px;"><b>Hi __EMAIL__!</b></td></tr>' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 10px 20px 8px 20px;">You have requested a password reset via the node-webapp-template website.</td></tr>' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 0px 20px 10px 20px;">Please proceed with the password change by clicking the link below.</td></tr>' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 10px 20px 10px 20px;"><a href="http://localhost:2509/email/doResetPasswordRequest/__REQUEST__" class="btn">Click Here</a></td></tr>' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 10px 20px 8px 20px;">This request will expire in 5 minutes.</td></tr>' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 0px 20px 10px 20px;">Do not forget to provide the Reset Token presented below.</td></tr>' +
'<tr><td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; padding: 20px 20px 20px 20px; font-size: 18px;"><b>__TOKEN__</b></td></tr>' +
'<tr><td style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif; padding: 20px 20px 30px 20px;"><b>Yours, node-webapp-template Team</b><br>support@node-webapp-template</td></tr>' +
'</table></body></html>';

var transporter = nodemailer.createTransport({
    host: nconf.get('app_mailer:host'),
    port: nconf.get('app_mailer:tcp_port'),
    auth: {
        user: nconf.get('app_mailer:username'),
        pass: nconf.get('app_mailer:password')
    }
});

var funcSendMail = function (data) {

    transporter.sendMail(data, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}

module.exports = {
    doSendMail: funcSendMail,
    pwdResetMailBodyHTML: pwdResetMailBodyHTML,
    newAccountVerificationMailBodyHTML: newAccountVerificationMailBodyHTML
}