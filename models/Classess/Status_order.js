class Status_order {
    static async getBySysname({sysname}, query) {
        return new Promise((prom_result, prom_error) => {
            query(`SELECT * FROM Status_order WHERE sysname = '${sysname}'`, function(query_err, query_rows, fields) {
                if (query_err) return prom_error(query_err);
                prom_result(query_rows)
            });
        })
    }

    static async getById({id}, query) {
        return new Promise((prom_result, prom_error) => {
            query(`SELECT * FROM Status_order WHERE id = '${id}'`, function(query_err, query_rows, fields) {
                if (query_err) return prom_error(query_err);
                prom_result(query_rows[0])
            });
        })
    }
}

module.exports = Status_order;
