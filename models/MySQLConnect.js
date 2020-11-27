
const Connetction = async (SQL_query) => {
    var mysql      = require('mysql');
    var connection = mysql.createConnection({

        connectionLimit : 50,
        connectTimeout  : 60000,
        acquireTimeout  : 60000,

        host     : '95.31.10.133',
        port     : '3306',

        user     : 'hackathon',
        password : 'kks0Ta@elKKms',
        database: 'hackathon',
        dateStrings: 'TIMESTAMP',
    });

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
