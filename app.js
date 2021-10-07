var http = require('http');
var url = require('url');
var express = require('express');
var nconf = require('nconf');
var path = require('path');

const static_folder = "/static";
const static_folder_html = "/static/html";

nconf.file( {file: './config/webapp-template-config.json'});

const objUserAuth = require('./services/userAuthentication');
const objUserMgmt = require('./services/userManagement');

var app = express();

//app.use('/assets', express.static(__dirname + '/static/html'));
app.use(express.json());

//########## URLs mapping ##########
//__dirname : It will be resolved to your project folder.

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + static_folder +  '/html/index.html'));
});
app.get('/css/*', function (req, res) {
    var filename = url.parse(req.url).pathname;
    res.sendFile(path.join(__dirname + static_folder + filename));
});
app.get('/img/*', function (req, res) {
    var filename = url.parse(req.url).pathname;
    res.sendFile(path.join(__dirname + static_folder + filename));
});
app.get('/fonts/*', function (req, res) {
    var filename = url.parse(req.url).pathname;
    res.sendFile(path.join(__dirname + static_folder + filename));
});
app.get('*.html', function (req, res) {
    var filename = url.parse(req.url).pathname;
    res.sendFile(path.join(__dirname + static_folder_html + filename));
});
app.get('/lib-js/*', function (req, res) {
    var filename = url.parse(req.url).pathname;
    res.sendFile(path.join(__dirname + static_folder + filename));
});

//Must be placed below lib-js so both js library files and individual js scripts can be loaded
app.get('*.js', function (req, res) {
    var filename = url.parse(req.url).pathname;
    res.sendFile(path.join(__dirname + static_folder_html + filename));
});


//########## APIs mapping ##########
//##### User Authentication #####
app.post('/api/doLogin', function (req, res) {
    res.json(objUserAuth.doLogin(req.body, req.headers['user-agent']));
});
app.post('/api/doLogoff', function (req, res) {
    res.json(objUserAuth.doLogoff(req.body, req.headers['user-agent']));
});
app.post('/api/doPwdReset', function (req, res) {
    res.json(objUserAuth.doPasswordReset(req.body));
});

//##### User Management #####
app.post('/api/doCreateUser', function (req, res) {
    res.json(objUserMgmt.doCreateUser(req.body));
});
app.post('/api/doUpdateUser', function (req, res) {
    res.json(objUserMgmt.doUpdateUser(req.body));
});
app.post('/api/doUpdateUserPassword', function (req, res) {
    res.json(objUserMgmt.doUpdateUserPassword(req.body));
});
app.get('/api/doFetchUsersList', function (req, res) {
    res.json(objUserMgmt.doFetchUsersList(req.body));
});
app.get('/api/doFetchUsersDeviceList', function (req, res) {
    res.json(objUserMgmt.doFetchUsersDeviceList(req.headers['userid'], req.headers['authenticationtoken']));
});
app.get('/api/doFetchUsersDetail', function (req, res) {
    res.json(objUserMgmt.doFetchUsersDetail(req.body));
});

var port = process.env.PORT || nconf.get('app_parameters:tcp_port');
var port = nconf.get('app_parameters:tcp_port');
process.title = 'webapp template running on node.js';

console.log("Starting webapp template service...");

app.listen(port);

console.log("webapp template started on port " + port);