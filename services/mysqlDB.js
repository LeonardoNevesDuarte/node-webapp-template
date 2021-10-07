var mysql = require('mysql');
var nconf = require('nconf');

nconf.file({ file: './config/webapp-template-config.json' });

var dbReferences = [];

dbReferences[0] = nconf.get('app_mysql_db:host');
dbReferences[1] = nconf.get('app_mysql_db:database');
dbReferences[2] = nconf.get('app_mysql_db:username');
dbReferences[3] = nconf.get('app_mysql_db:password');

var funOpenDBConnection = function() {

    var connection = mysql.createConnection({
        host: dbReferences[0],
        database: dbReferences[1],
        user: dbReferences[2],
        password: dbReferences[3]
    });
    return connection;
}

var funCloseDBConnection = function (conn) {
    conn.end();
}

module.exports = {
    doConnect: funOpenDBConnection,
    doDisconnect: funCloseDBConnection
}