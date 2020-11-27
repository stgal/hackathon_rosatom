const MySQLModel = require('../MySQLModel');

class User {
    static async getById(id) {
        let SQL_query = 'SELECT * FROM User WHERE id = ' + id
        let result = await MySQLModel.query(SQL_query)
        return result
    }
}

module.exports = User;
