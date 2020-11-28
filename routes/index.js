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

router.post('/audio-command', async (req, res, next) => {

    let fs = require('fs');

    // console.log(req.query)

    console.log("RECIEVED AUDIO TO EXTRACT INDICATORS: ", req.body);

    if (req.headers['content-type'] === 'audio/wav') {
        fs.writeFile('./audio/input_test/' + moment().unix() + '.mp4', req.body, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }

    // if (req.headers['content-type'] === 'audio/*') {
    //     fs.writeFile('./audio/input_test/' + moment().unix() + '.mp4', JSON.stringify(req.body), function (err) {
    //         if (err) throw err;
    //         console.log('Saved!');
    //     });
    // }

    res.send({text: 'Провести техническое обсулживание ППТК-20'})
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

//convert
router.get('/lil', (req, res, next) => {
    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath);
    let track = './audio/input/test_vk.mp4';

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
        })
        .save('./audio/output/test_vk_mp3_mp4.wav');
})

router.get('/send', (req, res, next) => {
    var FormData = require('form-data');
    var fs = require('fs');

    var form = new FormData();
    form.append('file', fs.createReadStream('./audio/output/test_vk_mp3_mp4.wav'));

    form.submit('https://rca-audio.herokuapp.com/audio-command', function(err, res) {
        console.log(err, res)
        res.resume();
    });
})

module.exports = router;
