#!/bin/bash

CONTAINER="twitter-scrapper-db"
MONGO_USER="${MONGODB_USER:-rwusr}"
MONGO_PWD="${MONGODB_USER:-password}"
MONGO_DB="${MONGODB_USER:-twitter-scrapper}"
echo $MONGO_DB
echo $MONGO_PWD
echo $MONGO_USER

docker exec -it $CONTAINER mongo $MONGO_DB -u $MONGO_USER -p $MONGO_PWD
