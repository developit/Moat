#!/bin/bash


# kill running moat.py

ps | grep moat.py$ | cut -d' ' -f1 | xargs kill


# start new server

if [ $1=="bg" ]; then
	nohup python moat.py &
else
	python moat.py &
fi
