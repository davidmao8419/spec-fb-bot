#!/bin/bash
cd /Users/davidmao/Documents/CornellTech/specProj/fb-bot
echo "--Adding--"
env -i git add .
echo "--Committing--"
env -i git commit -m 'heroku commit'
echo "--Pushed--"
env -i git push heroku master
echo "--Completed--"
