
const Connetction = async (SQL_query) => {
    var mysql      = require('mysql');
    var connection = mysql.createConnection(require('../config').mysql);

    connection.connect();

    let request = new Promise((res, rej) => {
        connection.query(SQL_query, function(err, rows, fields) {
            if (err) return rej(err);
            res(rows)
        });
    });

    let result = await request;
    connection.end();
    return result
};


module.exports = Connetction;
