#!/bin/bash

# If ENV is not set, set it to development
if [[ $NODE_ENV == "development" ]]; then
    echo Launching server...
    node dist/server.js
fi
