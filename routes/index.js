var express = require('express');
var router = express.Router();

const User = require('../models/Classess/User')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'САМОЕ ЛУЧШЕ ПРИЛОЖЕНИЕ' });
});


router.get('/user', async (req, res, next) => {
  let res_query = await User.getById(1)
  res.send(res_query);
})


module.exports = router;
