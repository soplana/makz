"use strict";

var cron = require("../node_modules/cron/lib/cron").CronJob,
    url = "http://weather.livedoor.com/forecast/webservice/json/v1?city=130010";

module.exports = function (robot) {
  new cron("49 * * * *", function () {
    var http = robot.http(url).get();

    http(function (err, res, body) {
      var json = JSON.parse(body);
      robot.send({ room: "general" }, json.forecasts);
    });
  }).start();
};