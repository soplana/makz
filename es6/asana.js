var cron    = require('cron').CronJob,
    moment  = require("moment-timezone"),
    asana   = require('asana'),
    _       = require('underscore');

class AsanaRequest {
  constructor(robot) {
    this.client = asana.Client.create().useAccessToken(process.env.HUBOT_ASANA_TOKEN);
    this.today  = moment(new Date()).format("YYYY-MM-DD");
    this.robot  = robot;
  }

  // Reference: https://asana.com/developers/api-reference/tasks
  // asana-node: https://github.com/Asana/node-asana/blob/master/lib/resources/gen/tasks.js
  getTasks() {
    this.client.workspaces.findAll()
      .then((res)=>{
        this.client.projects.findAll({
          workspace: res.data[0].id
        })
        .then((res)=>{
          this.client.tasks.findByProject(res.data[0].id, {
            opt_fields: 'id,name,assignee,completed,due_on'
          })
          .then((response)=>{
            return response.data
          })
          .filter((task)=>{
            return task.due_on === this.today
          })
          .then((tasks)=>{
            var asana_tasks = new AsanaTaskList(tasks);
            this.robot.send({room: "general"}, asana_tasks.createMessage());
          })
        })
      })
  }
};

class AsanaTaskList {
  constructor(tasks){
    this.tasks = tasks;
  }

  createMessage() {
    if(_.isEmpty(this.tasks)) return null;

    var message = "今日の予定は、\n"
    var i = 0;
    _.each(this.tasks, (task)=>{
      i += 1;
      message += `[${i}] ${task.name}\n`
    });

    return `${message}の${i}つだよ。ちゃんとやろうね。`
  }
};

module.exports = (robot)=>{
  new cron("50 6 * * *", ()=>{
    try{
      var asana = new AsanaRequest(robot);
      asana.getTasks();
    }catch(e){
      robot.send({room: "general"}, e.message)
    }
  }).start()
};
