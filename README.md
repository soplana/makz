# makz
家庭用slackに常駐させると便利なhubot

## 機能
### お天気通知
毎朝8:15に今日の天気と気温を知らせてくれます

### おしゃべり機能
話しかけると答えてくれます  
ドコモの[雑談対話API](https://dev.smt.docomo.ne.jp/?p=docs.api.page&api_name=dialogue&p_name=api_usage_scenario)を利用しています

## 起動

```
$ npm install
```

起動に必要な環境変数を設定します

```bash:.bashrc
# slackのToken
export HUBOT_SLACK_TOKEN=xxxxxxxxxxxxxxxx

# docomo APIのToken
export HUBOT_DOCOMO_DIALOGUE_API_KEY=xxxxxxxxxxxxxxx
```

起動スクリプトに実行権限を与えます

```
$ chmod u+x run.sh
```


shellで起動する

```
$ ./run.sh
```

slackで起動する  

デーモン化には`forever`を使用しています
```
$ ENV=production ./run.sh
```
