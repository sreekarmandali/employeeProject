var fs = require("fs");

exports.writeToFile = (data) => {
  fs.appendFile("C:\\Users\\Srinu\\employeeProject\\public\\files\\output.txt", data, function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
};
