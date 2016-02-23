"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var cron = require("cron").CronJob,
    moment = require("moment-timezone"),
    asana = require("asana"),
    _ = require("underscore");

var AsanaRequest = (function () {
  function AsanaRequest(robot) {
    _classCallCheck(this, AsanaRequest);

    this.client = asana.Client.create().useAccessToken(process.env.HUBOT_ASANA_TOKEN);
    this.today = moment(new Date()).format("YYYY-MM-DD");
    this.robot = robot;
  }

  _createClass(AsanaRequest, {
    getTasks: {

      // Reference: https://asana.com/developers/api-reference/tasks
      // asana-node: https://github.com/Asana/node-asana/blob/master/lib/resources/gen/tasks.js

      value: function getTasks() {
        var _this = this;

        this.client.workspaces.findAll().then(function (res) {
          _this.client.projects.findAll({
            workspace: res.data[0].id
          }).then(function (res) {
            _this.client.tasks.findByProject(res.data[0].id, {
              opt_fields: "id,name,assignee,completed,due_on"
            }).then(function (response) {
              return response.data;
            }).filter(function (task) {
              return task.due_on === _this.today;
            }).then(function (tasks) {
              var asana_tasks = new AsanaTaskList(tasks);
              _this.robot.send({ room: "general" }, asana_tasks.createMessage());
            });
          });
        });
      }
    }
  });

  return AsanaRequest;
})();

;

var AsanaTaskList = (function () {
  function AsanaTaskList(tasks) {
    _classCallCheck(this, AsanaTaskList);

    this.tasks = tasks;
  }

  _createClass(AsanaTaskList, {
    createMessage: {
      value: function createMessage() {
        if (_.isEmpty(this.tasks)) {
          return null;
        }var message = "今日の予定は、\n";
        var i = 0;
        _.each(this.tasks, function (task) {
          i += 1;
          message += "[" + i + "] " + task.name + "\n";
        });

        return "" + message + "の" + i + "つだよ。ちゃんとやろうね。";
      }
    }
  });

  return AsanaTaskList;
})();

;

module.exports = function (robot) {
  new cron("50 6 * * *", function () {
    try {
      var asana = new AsanaRequest(robot);
      asana.getTasks();
    } catch (e) {
      robot.send({ room: "general" }, e.message);
    }
  }).start();
};