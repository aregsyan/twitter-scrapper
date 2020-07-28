#!/bin/bash

CONTAINER="twitter-scrapper-db"

mkdir -p db && \
docker stop $CONTAINER  || true && docker rm $CONTAINER || true && \
docker run -v "$(pwd)"/mongodb:/data/db -p 27017:27017 -d --name $CONTAINER mongo:latest
