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

            //проверка поля class_order_id
            if (!params.hasOwnProperty('orderClassId') && params.hasOwnProperty('orderClass')) {
                let class_order = await MySQLModel.query('Class_order', 'getBySysname', {sysname: params.orderClass})
                query_params.class_order_id = class_order[0].id
            } else if (params.hasOwnProperty('orderClassId')) {
                query_params.class_order_id = params.orderClassId
            } else {
                throw 'Не передан параметр orderClassId или orderClass'
            }

            //проверка поля priority_id
            if (!params.hasOwnProperty('priorityId') && params.hasOwnProperty('priority')) {
                let priority_order = await MySQLModel.query('Priority_order', 'getBySysname', {sysname: params.priority})
                query_params.priority_id = priority_order[0].id
            } else if (params.hasOwnProperty('priorityId')) {
                query_params.priority_id = params.priorityId
            } else {
                throw 'Не передан параметр priorityId или priority'
            }

            let group_executors
            //проверка поля performerId
            if (!params.hasOwnProperty('performerId') && params.hasOwnProperty('performer')) {
                group_executors = await MySQLModel.query('Group_executors', 'getBySysname', {sysname: params.performer})
                group_executors = group_executors[0]
                query_params.group_executors_id = group_executors.id

            } else if (params.hasOwnProperty('priorityId')) {
                group_executors = await MySQLModel.query('Group_executors', 'getById', {id: query.performerId})
                query_params.group_executors_id = params.performerId

            } else {
                throw 'Не передан параметр performerId или performer'
            }


            //ПОЛУЧАЕМ id первичного статуса NEW
            let status_new = await MySQLModel.query('Status_order', 'getBySysname', {sysname: 'NEW'})


            let request_insert_into_order = 'INSERT INTO `Order` (end_data_plan, created_data, comment, title, group_executors_id, priority_id, created_user_id,class_order_id,type_order_id,status_order_id'
                + ' ) VALUES (' +
                `'${query_params['end_data_plan']}', '${query_params['created_data']}', '${query_params['comment']}', '${query_params['title']}', '${query_params['group_executors_id']}', '${query_params['priority_id']}', '${query_params['created_user_id']}', '${query_params['class_order_id']}', '${query_params['type_order_id']}', '${status_new[0].id}')`


            let result_insert_into_order = await new Promise((resolve, reject) => {
                query(request_insert_into_order, function(query_err, query_rows, fields) {
                    if (query_err) return prom_error(query_err);
                    resolve({id: query_rows.insertId})
                });
            })

            //ДОБАВЛЕНИЕ ИСПОЛНИТЕЛЕЙ
            let executor_user_ids = []

            if (group_executors.sysname === 'ALL') {
                let all_users = await MySQLModel.query('User', 'getAll')
                executor_user_ids = all_users.map(user => {
                    return user.id
                })
            } else if (group_executors.sysname === 'ONE') {
                if (!params.hasOwnProperty('performer_user_id')) throw 'Если группа исполнителей group_executors=ONE, то должен передаваться параметр: performer_user_id'
                executor_user_ids = [params.performer_user_id]
            }
            await MySQLModel.query('Executor_order', 'addExecutorsOrder', {
                order_id: result_insert_into_order.id,
                user_ids: executor_user_ids
            })

            prom_result(result_insert_into_order)
        })
    }

    static async getAll(params, query) {

        let query_select_order = 'SELECT * FROM `Order`'

        let result_select_order = await new Promise((resolve, reject) => {
            query(query_select_order, function(query_err, query_rows, fields) {
                if (query_err) return reject(query_err);
                resolve(query_rows)
            });
        })

        //НЕОБХОДИМО ДОГРУЗИТЬ ЗНАЧЕНИЯ ЗАВИСЫМЫХ ПОЛЕЙ
        let orders = []
        let promises_arr = []

        result_select_order.forEach(order => {
            promises_arr.push(
                new Promise(async (resolve, reject) => {

                    let performer = await MySQLModel.query('Group_executors', 'getById', {id: order.group_executors_id})
                    let priority = await MySQLModel.query('Priority_order', 'getById', {id: order.priority_id})
                    let orderType = await MySQLModel.query('Type_order', 'getById', {id: order.type_order_id})
                    let orderStatus = await MySQLModel.query('Status_order', 'getById', {id: order.status_order_id})

                    orders.push({
                        ...order,
                        performer: performer.sysname,
                        priority: priority.sysname,
                        orderType: orderType.sysname,
                        orderStatus: orderStatus.sysname
                    })

                    resolve(null)
                })
            )
        })
        await Promise.all(promises_arr)

        return orders
    }
}

module.exports = Order;
