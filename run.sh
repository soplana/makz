#!/bin/bash

if [[ $ENV = "production" ]]; then
    forever start -c coffee node_modules/.bin/hubot -a slack
else
    ./node_modules/.bin/hubot
fi
