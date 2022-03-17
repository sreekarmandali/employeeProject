var express = require("express");
var router = express.Router();
var employeeService = require("../../services/employees/employee.service");

/* create Employee */
router.post("/", (req, res) => {
  employeeService.createEmployee(req, res);
});

router.get("/", (req, res) => {
  employeeService.getAllEmployees(res);
});

router.get("/:name", (req, res) => {
  employeeService.getEmployeeByName(req, res);
});

router.put("/:name", (req, res) => {
  employeeService.updateEmployeeByName(req, res);
});

router.delete("/:name", (req, res) => {
  employeeService.deletEmployeeByName(req, res);
});

module.exports = router;
