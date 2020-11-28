const moment = require('moment')
const MySQLModel = require('../MySQLModel')
class Order {
    static async add(params, query) {
        return new Promise(async (prom_result, prom_error) => {

            let query_params = {
                end_data_plan: params.deadlineData,
                created_data: moment().unix(),
                comment: params.bodyText,
                title: params.titleText,
                created_user_id: params.user_id,

                //group_executors_id: 1123, //TODO
                //priority_id: 1123, //TODO
                //class_order_id: 1123, //TODO

                // type_order_id: 123,

                end_data_fact: null,
                reaction_order_id: null,
                status_order_id: null,
            }

            //проверка поля type_order_id
            if (!params.hasOwnProperty('orderTypeId') && params.hasOwnProperty('orderType')) {
                let type_order = await MySQLModel.query('Type_order', 'getBySysname', {sysname: params.orderType})
                query_params.type_order_id = type_order[0].id
            } else if (params.hasOwnProperty('orderTypeId')) {
                query_params.type_order_id = query.orderTypeId
            } else {
                throw 'Не передан параметр orderTypeId или orderType'
            }



            if (!params.hasOwnProperty('orderClassId') && params.hasOwnProperty('orderClass')) {
                let type_order = await MySQLModel.query('Class_order', 'getBySysname', {sysname: params.orderClass})
                query_params.type_order_id = type_order[0].id
            } else if (params.hasOwnProperty('orderClassId')) {
                query_params.type_order_id = query.orderClassId
            }



            let request = 'INSERT INTO `Order` (end_data_plan, end_data_fact, created_data, comment, title, group_executors_id, priority_id, created_user_id,class_order_id,status_order_id,reaction_order_id,type_order_id'
                + ' ) VALUES (' +
                `'${query_params['end_data_plan']}', '${query_params['end_data_fact']}', '${query_params['created_data']}', '${query_params['comment']}', '${query_params['title']}', '${query_params['group_executors_id']}', '${query_params['priority_id']}', '${query_params['created_user_id']}', '${query_params['class_order_id']}', '${query_params['status_order_id']}', '${query_params['reaction_order_id']}', '${query_params['type_order_id']}')`

            query(request, function(query_err, query_rows, fields) {
                if (query_err) return prom_error(query_err);
                prom_result({id: query_rows.insertId})
            });
        })
    }
}

module.exports = Order;
