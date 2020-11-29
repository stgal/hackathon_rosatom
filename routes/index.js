let express = require('express');
let router = express.Router();

const moment = require('moment')

const User = require('../models/Classess/User')

router.get('/', function(req, res, next) {
    res.send('^-^')
});

router.get('/profile', async (req, res, next) => {
    let result
    if (req.query.hasOwnProperty('id')) {
        result = await require('../models/MySQLModel').query('User', 'getById', {id: req.query.id})
    } else {
        result = await require('../models/MySQLModel').query('User', 'getAll')
    }
    res.send(result)
})

router.post('/audio-command', async (req, res, next) => {
    res.send({text: 'Провести техническое обсулживание ППТК-20'})
    return
    let fs = require('fs');

    let file_name = moment().unix()
    let ext_orig = '.mp4'
    let ext_for_parse = '.wav'

    await save_audio_file(req, file_name);
    await convert_audio_and_save(file_name, ext_orig, ext_for_parse)

    send_file_to_parsing()
    let string_parse = await get_parse_string(file_name, ext_for_parse)

    res.send({text: string_parse})
})

router.post('/addOrder', async (req, res, next) => {
    var result = await require('../models/MySQLModel').query('Order', 'add', {
        user_id: 1,
        ...req.body
    })
    res.send(result)
})

// getSummary (отчёт)

router.get('/sensors', async (req, res, next) => {
    //api стороннего сервиса, которое возвращает информацию по сенсорам
    let sensors = require('../mock_data').sensors()
    res.send(sensors)
})

router.get('/orders', async (req, res, next) => {
    let result = await require('../models/MySQLModel').query('Order', 'getAll')
    // let orders = require('../mock_data').order()
    res.send(result)
})

router.get('/summary', async (req, res, next) => {
    res.send({
        text: 'Какой то очень важный текст, не помню что здесь должно быть бла-бла-бла'
    })
})


let save_audio_file = (req, file_name, ext_orig) => {
    return new Promise((err, res) => {
        if (req.headers['content-type'] === 'audio/wav') {
            fs.writeFile('./audio/input/' + file_name + ext_orig, req.body, function (err) {
                if (err) throw err;
                res(null)
            });
        }
    })
}
let convert_audio_and_save = (file_name, ext_orig, ext_for_parse) => {
    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath);
    let track = './audio/input/' + file_name + ext_orig;

    return new Promise((err, res) => {
        ffmpeg(track)
            .toFormat('wav')
            .on('error', (err) => {
                console.log('An error occurred: ' + err.message);
            })
            .on('progress', (progress) => {
                console.log('Processing: ' + progress.targetSize + ' KB converted');
            })
            .on('end', () => {
                console.log('Processing finished !');
                res(null)
            })
            .save('./audio/output/' + file_name + ext_for_parse);
    })

}
let send_file_to_parsing = (file_name, ext_for_parse) => {
    var FormData = require('form-data');
    var form = new FormData();
    form.append('file', fs.createReadStream('./audio/output/' + file_name + ext_for_parse));
    form.submit('https://rca-audio.herokuapp.com/audio-command', function(err, res) {
        res.resume();
    });
}
let get_parse_string = (file_name, ext_for_parse) => {
    var http = require('http');

    var data = JSON.stringify({
        file_name: file_name + ext_for_parse,
    });

    return new Promise((err, res) => {
        let timerId = setInterval(() => {
            var options = {
                host: 'rca-audio.herokuapp.com',
                path: 'get_parse',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(data)
                }
            };

            var httpreq = http.request(options, function (response) {
                response.setEncoding('utf8');
                response.on('data', function (chunk) {
                    if (chunk.hasOwnProperty('text_from_audio')) {
                        res(string_parse)
                        clearInterval(timerId)
                    }
                });
                response.on('end', function() {
                    res.send('ok');
                })
            });
            httpreq.write(data);
            httpreq.end();
        }, 1000);
    })
}

module.exports = router;
