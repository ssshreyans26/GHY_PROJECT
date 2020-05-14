var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/customer',function(req,res,next){
  res.render('customer')
})



module.exports = router;
