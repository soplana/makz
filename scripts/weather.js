"use strict";

var cron = require("../node_modules/cron/lib/cron").CronJob,
    request = require("request");

var ops = {
  url: "http://weather.livedoor.com/forecast/webservice/json/v1?city=130010",
  json: true
};

var emoji = {
  晴れ: ":sunny:",
  晴時々曇: ":sun_behind_cloud:",
  曇り: ":cloud:",
  雨: ":rain_cloud:",
  晴のち曇: ":sun_behind_cloud:",
  雨のち曇: ":rain_cloud:",
  曇のち晴: ":sun_small_cloud:",
  雨のち晴: ":sun_behind_rain_cloud:",
  曇のち雨: ":rain_cloud:",
  晴のち雨: ":sun_behind_rain_cloud:"
};

function weather(robot) {
  try {
    request.get(ops, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var today = body.forecasts[0],
            description = body.description,
            message = "";

        if (!!today) {
          var telop = today.telop,
              temperature = today.temperature;

          message += "今日の天気は" + telop + "" + emoji[telop] + "です。\n";

          if (!!temperature) {
            if (!!temperature.min) message += "最低気温は" + temperature.min.celsius + "}度、";
            if (!!temperature.max) message += "最高気温は" + temperature.max.celsius + "度です。";
          };
        }
        robot.send({ room: "general" }, message);
      }
    });
  } catch (e) {
    robot.send({ room: "general" }, e.message);
  }
};

module.exports = function (robot) {
  new cron("15 7 * * *", function () {
    weather(robot);
  }).start();
};