#!/bin/bash

# kill running server

if ["$1"="stop"]; then
	ps | grep moat.py$ | cut -d' ' -f1 | xargs kill
fi


# start new server

if ["$1"="start"]; then
	nohup python moat.py &
fi


# restart server

if ["$1"="restart"]; then
	ps | grep moat.py$ | cut -d' ' -f1 | xargs kill
	nohup python moat.py &
fi


