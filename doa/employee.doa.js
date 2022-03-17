"use strict";
const employeeSchema = require("../models/employee.model");
const EventEmitter = require("events");
const createdEvent = new EventEmitter();
const filewriter = require("../file/filewriter");
var loggerObject = require("../common/json_logger");
const LOGLEVEL = loggerObject.LOGLEVEL;
var report = loggerObject.report;

const expressPino = require("pino")(
  loggerObject.opts,
  loggerObject.pino.destination(loggerObject.LOG_DESTINATION)
);
var logger = loggerObject.logger(expressPino);

exports.create = (res, body) => {
  const employee = new employeeSchema(body);

  employee
    .save()
    .then((data) => {
      report(LOGLEVEL.INFO, "Employee created successflly");
      createdEvent.emit("created", data);
      res.send(data);
    })
    .catch((err) => {
      report(
        LOGLEVEL.ERROR,
        "Exception thrown in db while creating employee",
        JSON.stringify(err)
      );
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Employee",
      });
    });
};

exports.findAll = (res) => {
  employeeSchema
    .find()
    .then((data) => {
      report(LOGLEVEL.INFO, "Employees fetched successflly");
      res.send(data);
    })
    .catch((err) => {
      report(
        LOGLEVEL.ERROR,
        "Exception thrown in db while fetching employees",
        JSON.stringify(err)
      );
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving employees.",
      });
    });
};

exports.findOne = (res, name) => {
  employeeSchema
    .findOne({ name: new RegExp(name, "i") })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Not found employee with name " + name,
        });
        report(
          LOGLEVEL.ERROR,
          "Exception thrown in db while fetching employee with name" + name,
          JSON.stringify(data)
        );
      } else {
        report(
          LOGLEVEL.INFO,
          "Employee fetched successflly",
          JSON.stringify(data)
        );
        res.send(data);
      }
    })
    .catch((err) => {
      report(
        LOGLEVEL.ERROR,
        "Exception thrown in db while fetching employee with name" + name,
        JSON.stringify(err)
      );
      res.status(500).send({
        message: "Error retrieving employee with name=" + name,
      });
    });
};
exports.update = (res, body, name) => {
  employeeSchema
    .findOneAndUpdate({ name: name }, body)
    .then((data) => {
      if (!data) {
        report(
          LOGLEVEL.ERROR,
          "Exception thrown in db while updating",
          JSON.stringify(data)
        );
        res.status(404).send({
          message: `Cannot update employee with name=${name}. Maybe employee was not found!`,
        });
      } else {
        report(LOGLEVEL.INFO, "Updated successflly", JSON.stringify(data));
        res.send({
          message: "Employee was updated successfully.",
        });
      }
    })
    .catch((err) => {
      report(
        LOGLEVEL.ERROR,
        "Exception thrown in db while updating",
        JSON.stringify(err)
      );
      res.status(500).send({
        message: "Error updating employee with name=" + name,
      });
    });
};

exports.delete = (res, name) => {
  employeeSchema
    .findOneAndRemove({ name: name })
    .then((data) => {
      if (!data) {
        report(
          LOGLEVEL.ERROR,
          "Exception thrown in db while deleting",
          JSON.stringify(data)
        );
        res.status(404).send({
          message: `Cannot delete Employee with name=${name}. Maybe Employee was not found!`,
        });
      } else {
        report(LOGLEVEL.INFO, "Deleted successflly", JSON.stringify(data));
        res.send({
          message: "Employee was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      report(
        LOGLEVEL.ERROR,
        "Exception thrown in db while deleting",
        JSON.stringify(err)
      );
      res.status(500).send({
        message: "Could not delete Employee with name=" + name,
      });
    });
};

createdEvent.on("created", (data) => {
  filewriter.writeToFile(JSON.stringify(data));
});
