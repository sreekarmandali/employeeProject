var employeedao = require("../../doa/employee.doa");

exports.createEmployee = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  body = {
    name: req.body.name,
    department: req.body.department,
    salary: req.body.salary,
  };
  employeedao.create(res, body);
};

exports.getAllEmployees = (res) => {
  employeedao.findAll(res);
};

exports.getEmployeeByName = (req, res) => {
  var name = req.params.name;
  employeedao.findOne(res, name);
};

exports.updateEmployeeByName = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  body = {
    name: req.body.name,
    department: req.body.department,
    salary: req.body.salary,
  };
  var name = req.params.name;
  employeedao.update(res, body, name);
};
exports.deletEmployeeByName = (req, res) => {
  var name = req.params.name;
  employeedao.delete(res, name);
};
