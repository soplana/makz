var cron    = require('cron').CronJob,
    moment  = require("moment-timezone"),
    request = require('request'),
    _       = require('underscore');

var ops = {
  url: "http://konkinoani.me/user/crifff?json",
  json: true
};

class AnimeScheduler {
  constructor(data) {
    this.anime      = data;
    this.anime_time = moment(data["StTime"], "X").tz("Asia/Tokyo");
  };

  isScheduledToStart(minute=30) {
    var now = moment().tz("Asia/Tokyo");

    return this.anime_time.isBetween(now, moment(now).add(minute,"m"))
  };

  createMessage() {
    var message  = `${this.anime_time.hour()}`;
 
    if(this.anime_time.minute() !== 0)
      message += `時${this.anime_time.minute()}分`;
    else
      message += "時";
    
    message += `から【${this.anime["Title"]}】の放送が始まるよ。`;
    return message
  }
};

function anime_push(robot){
  try{
    request.get(ops, (error, response, body)=>{
      if (!error && response.statusCode == 200) {

        _.each(body, (data)=>{
          var anime = new AnimeScheduler(data);
          
          if(anime.isScheduledToStart())
            robot.send({room: "general"}, anime.createMessage())
        });

      }      
    });
  }catch(e){
    robot.send({room: "general"}, e.message)
  }
};

module.exports = (robot)=>{
  new cron("15,45 * * * *", ()=>{anime_push(robot)}).start()
};
