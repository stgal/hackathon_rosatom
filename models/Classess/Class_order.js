class Class_order {
    static async getBySysname({sysname}, query) {
        return new Promise((prom_result, prom_error) => {
            query(`SELECT * FROM Class_order WHERE sysname = '${sysname}'`, function(query_err, query_rows, fields) {
                if (query_err) return prom_error(query_err);
                prom_result(query_rows)
            });
        })
    }
}

module.exports = Class_order;
