var express = require('express');
var router = express.Router();
var employeedao = require('../doa/employee.doa')

/* create Employee */
router.post('/', (req, res) => {
  employeedao.create(req,res)
});

router.get('/', (req, res) => {
  employeedao.findAll(req,res)
});

router.get('/:name', (req, res) => {
  employeedao.findOne(req,res)
});

router.put('/:name', (req, res) => {
  employeedao.update(req,res)
});

router.delete('/:name', (req, res) => {
  employeedao.delete(req,res)
});

module.exports = router;
