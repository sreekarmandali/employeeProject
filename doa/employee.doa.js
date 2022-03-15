const employeeSchema = require("../models/employee.model");
const EventEmitter = require("events");
const createdEvent = new EventEmitter();
const filewriter = require("../file/filewriter");

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const employee = new employeeSchema({
    name: req.body.name,
    department: req.body.department,
    salary: req.body.salary,
  });

  employee
    .save()
    .then((data) => {
      createdEvent.emit("created", data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Employee",
      });
    });
};

exports.findAll = (req, res) => {
  employeeSchema
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving employees.",
      });
    });
};

exports.findOne = (req, res) => {
  const name = req.params.name;
  employeeSchema
    .findOne({ name: new RegExp(name, "i") })
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "Not found employee with name " + name,
        });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving employee with name=" + name,
      });
    });
};
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  employeeSchema
    .findOneAndUpdate({ name: req.params.name }, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update employee with name=${name}. Maybe employee was not found!`,
        });
      } else
        res.send({
          message: "employee was updated successfully.",
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating employee with name=" + name,
      });
    });
};

exports.delete = (req, res) => {
  const name = req.params.name;
  employeeSchema
    .findOneAndRemove({ name: req.params.name })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Employee with name=${name}. Maybe Employee was not found!`,
        });
      } else {
        res.send({
          message: "Employee was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Employee with name=" + name,
      });
    });
};

createdEvent.on("created", (data) => {
  filewriter.writeToFile(JSON.stringify(data));
});
