class User {
    static async addExecutorsOrder({order_id, user_ids}, query) {

        let row_ids = []
        let promises_arr = []

        user_ids.forEach(user_id => {
            promises_arr.push(
                new Promise((resolve, reject) => {
                    let query_insert_into = 'INSERT INTO `Executor_order`' + `(order_id, user_id) VALUE (${order_id},${user_id})`
                    query(query_insert_into, function(query_err, query_rows, fields) {
                        if (query_err) return reject(query_err);
                        row_ids.push(query_rows.insertId)
                        resolve(null)
                    });
                })
            )
        })
        await Promise.all(promises_arr)
        return row_ids
    }

}

module.exports = User;
