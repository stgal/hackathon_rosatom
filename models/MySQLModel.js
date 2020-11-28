let Connection = require('./MySQLConnect')

class MySQLModel {
    static async query (class_, method, params) {
        let connection = Connection()

        connection.connect()
        let result = await require('./Classess/' + class_)[method](params, connection.query.bind(connection));

        connection.end()

        return result
    }
}

module.exports = MySQLModel;
