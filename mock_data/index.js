const moment = require('moment')

const order = () => {
    var orders = []

    let titleText = [
        'Разгрузить',
        'Проверить',
        'Обслужить',
        'Починить'
    ]

    let priority = [
        'MEDIUM',
        'LOW',
        'HIGH',
        'CRITICAL'
    ]

    for (let i = 1; i < 80; i++) {
        orders.push({
            id: i,

            creatorId: Math.floor(Math.random() * Math.floor(10)),

            performer: 'All',
            createdData: moment().unix(),
            deadlineData: moment().unix() + 9999,
            titleText: titleText[Math.floor(Math.random() * Math.floor(4))],
            priority: priority[Math.floor(Math.random() * Math.floor(4))],
            orderType: 'TECHNOLOGICAL',
            orderStatus: 'New',
            bodyText: 'БЛА-БЛА-БЛА-БЛА-БЛА-БЛА-БЛА-БЛА ' + i
        })
    }

    return orders
}


module.exports = order
