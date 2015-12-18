"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var cron = require("cron").CronJob,
    moment = require("moment-timezone"),
    request = require("request"),
    _ = require("underscore");

var ops = {
  url: "http://konkinoani.me/user/crifff?json",
  json: true
};

var AnimeScheduler = (function () {
  function AnimeScheduler(data) {
    _classCallCheck(this, AnimeScheduler);

    this.anime = data;
    this.anime_time = moment(data.StTime, "X").tz("Asia/Tokyo");
  }

  _createClass(AnimeScheduler, {
    isScheduledToStart: {
      value: function isScheduledToStart() {
        var minute = arguments[0] === undefined ? 30 : arguments[0];

        var now = moment().tz("Asia/Tokyo");

        return this.anime_time.isBetween(now, moment(now).add(minute, "m"));
      }
    },
    createMessage: {
      value: function createMessage() {
        var message = "" + this.anime_time.hour();

        if (this.anime_time.minute() !== 0) message += "時" + this.anime_time.minute() + "分";else message += "時";

        message += "から【" + this.anime.Title + "】の放送が始まるよ。";
        return message;
      }
    }
  });

  return AnimeScheduler;
})();

;

function anime_push(robot) {
  try {
    request.get(ops, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        _.each(body, function (data) {
          var anime = new AnimeScheduler(data);

          if (anime.isScheduledToStart()) robot.send({ room: "general" }, anime.createMessage());
        });
      }
    });
  } catch (e) {
    robot.send({ room: "general" }, e.message);
  }
};

module.exports = function (robot) {
  new cron("15,45 * * * *", function () {
    anime_push(robot);
  }).start();
};