
const Connection = () => {
    var mysql      = require('mysql');
    var connection = mysql.createConnection(require('../config').mysql);

    return connection
};


module.exports = Connection;
