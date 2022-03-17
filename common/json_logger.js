const pino = require("pino");
const { config } = require("../config/api-config");

exports.LOGLEVEL = LOGLEVEL = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
};
exports.LOG_DESTINATION = LOG_DESTINATION = "./logs/employee.log";

const customRequestSerializer = function (req) {
  return {
    method: req.method,
    url: req.url,
    remoteAddress: req.remoteAddress,
    remotePort: req.remotePort,
    querP: req.query,
  };
};

function getLogLevel(i) {
  switch (i) {
    case 0:
      return "trace";
    case 1:
      return "debug";
    case 2:
      return "info";
    case 3:
      return "warn";
    case 4:
      return "error";
    default:
      return "debug";
  }
}
const opts = {
  level: getLogLevel(config.log.level),
  serilalizers: {
    wrapRequestSerializer: customRequestSerializer,
  },
  useLevelLabels: true,
  levelKey: "logLevel",
  base: { name: "employee" },
  timestamp: () => {
    return ', "time":"' + new Date().toUTCString() + '"';
  },
};

const jsonlogger = require("pino")(opts, pino.destination(LOG_DESTINATION));
const mergeParams = function (msg, params) {
  let mergeObj = {};
  if (params && params.errorType) {
    mergeObj.errorType = params.errorType;
  }
  if (params && params.errorObj) {
    if (params.errorObj instanceof Error) {
      mergeObj.errorMessage = params.errorObj.errorMessage;
      mergeObj.errorStack = params.errorObj.stack;
    } else {
      mergeObj.errorMessage = params.errorObj;
    }
  }
  return mergeObj;
};
var report;
exports.report = report = function (level, msg, params, childlogger) {
  const mergeObj = mergeParams(msg, params);
  if (childlogger) {
    childlogger[getLogLevel(level)](mergeObj, msg);
  } else {
    jsonlogger[getLogLevel(level)](mergeObj, msg);
  }
};

exports.logger = function (childlogger) {
  var interLogger = childlogger || jsonlogger;
  return {
    error: function (msg, params) {
      interLogger.error(mergeParams(msg, params));
    },
    warn: function (msg, params) {
      interLogger.warn(mergeParams(msg, params));
    },
    debug: function (msg, params) {
      interLogger.debug(mergeParams(msg, params));
    },
    trace: function (msg, params) {
      interLogger.trace(mergeParams(msg, params));
    },
    info: function (msg, params) {
      interLogger.info(mergeParams(msg, params));
    },
  };
};
// report(
//     LOGLEVEL.INFO,
//   `Employee api layer online logging at level: ${getLogLevel(config.log.level)}`
// );
exports.pino = pino;
exports.opts = opts;
