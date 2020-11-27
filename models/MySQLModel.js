let Connection = require('./MySQLConnect')

class MySQLModel {
    static async query (SQL_query) {
        let result = await Connection(SQL_query)
        return result
    }
}

module.exports = MySQLModel;
