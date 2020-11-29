const moment = require('moment')

const order = () => {
    var orders = []

    let titleText = [
        'Замена гранитных напольных плит',
        'Сломана рамка лючка',
        'Cледы протечки',
        'Искрит розетка',
        'Поправить уплотнитель',
        'Плитка шатается',
        'Грязно! приберитесь!',
        'Сломался насос'
    ]

    let priority = [
        'MEDIUM',
        'LOW',
        'HIGH',
        'CRITICAL'
    ]

    let bodyText = [
        'ТРЗ 4 часа ст. деж. инженер Липецкий В.В.; Подрядная организация АО "СтоунКонкритСервис"; Замена гранитных напольных плит с заделкой шфов Атриум 1-й этаж, А104 1-й этаж',
        'РД-1, помещене 6-2 Сломана рамка лючка.',
        'РД-1, помещене 6j Следы протечки на потолке.',
        'РД-1, помещене 6-4 Смотри фото.',
        'Поправить уплотнитель.',
        'Кухня 6 этаж, Администрация',
        'Вынести мусор',
        'Ответственный- ЭНЕРГОСЕРВИС К Неисправность: выход из строя частотного регулятора и статора насоса ОТ-08М2 котельной 104.2 из-за разгерметизации рубашки статора и протечки воды через клеммную колодку. Создал: Кондратьев В.',
    ]

    for (let i = 1; i < 16; i++) {
        let title_number = Math.floor(Math.random() * Math.floor(8))
        orders.push({
            id: i,
            creatorId: Math.floor(Math.random() * Math.floor(10)),
            performer: 'All',
            createdData: moment().unix(),
            deadlineData: moment().unix() + 9999,
            titleText: titleText[title_number],
            priority: priority[Math.floor(Math.random() * Math.floor(4))],
            orderType: 'TECHNOLOGICAL',
            orderStatus: 'New',
            bodyText: bodyText[title_number],
        })
    }
    return orders
}

const sensors = () => {
    let sensors_data = []

    let type = [
        'THERMOMETER',
        'BAROMETER',
        'CO2_METER',
    ]

    for (let i = 0; i < 15; i++) {
        sensors_data.push({
            value: parseFloat((Math.random() * Math.floor(100)).toFixed(2)),
            thresholdMin: 0,
            thresholdMax: 100,
            type: type[Math.floor(Math.random() * Math.floor(3))]
        })
    }
    return sensors_data
}

module.exports = {
    order,
    sensors
}
