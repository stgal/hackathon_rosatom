let express = require('express');
let router = express.Router();

const moment = require('moment')

const User = require('../models/Classess/User')

router.get('/', function(req, res, next) {
  res.render('index', { title: 'САМОЕ ЛУЧШЕ ПРИЛОЖЕНИЕ' });
});

router.get('/profile', async (req, res, next) => {
    let id = req.query.id
    res.send({id: req.query.hasOwnProperty('id') ? id : 1, name: 'Олег', position: 'Сварщик'})
})

router.get('/orders', async (req, res, next) => {
    res.send([{
        id: 1,
        creatorId: Math.floor(Math.random() * Math.floor(40)),
        performer: 'All',
        createData: moment().unix(),
        deadlineData: moment().unix() + 86400,
        titleText: 'Разгрузить',
        priority: 'MEDIUM',
        orderType: 'TECHNOLOGICAL',
        orderStatus: 'New',
        bodyText: 'Необходимо разгрузить грузчиков'
    }])
})

router.get('/summary', async (req, res, next) => {

    res.send({
        text: 'Какой то очень важный текст, не помню что здесь должно быть бла-бла-бла'
    })
})

router.post('/audio-command', async (req, res, next) => {
    let fs = require('fs');

    let file_name = moment().unix()
    let ext_orig = '.mp4'
    let ext_for_parse = '.wav'

    await save_audio_file(file_name);
    await convert_audio_and_save(file_name, ext_orig, ext_for_parse)

    send_file_to_parsing()
    let string_parse = await get_parse_string(file_name, ext_for_parse)

    res.send({text: 'Провести техническое обсулживание ППТК-20'})
})

let save_audio_file = (file_name, ext_orig) => {
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
