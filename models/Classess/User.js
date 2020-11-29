class User {
    static async getById({id}, query) {
        return new Promise((prom_result, prom_error) => {
            query('SELECT * FROM User WHERE id = ' + id, function(query_err, query_rows, fields) {
                if (query_err) return prom_error(query_err);
                prom_result(query_rows)
            });
        })
    }

    static async getAll(params, query) {
        return new Promise((prom_result, prom_error) => {
            query('SELECT * FROM User' , function(query_err, query_rows, fields) {
                if (query_err) return prom_error(query_err);
                prom_result(query_rows)
            });
        })
    }
}

module.exports = User;
