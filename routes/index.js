
var express = require('express');
var router = express.Router({mergeParams:true});
var bodyParser = require('body-parser') 
var cookieParser = require('cookie-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());


router.use('/',require('./employess'))
module.exports = router;
