#!/usr/bin/env bash

mongo ${MONGODB_DB} \
        --host localhost \
        --port ${MONGODB_PORT} \
        -u ${MONGO_INITDB_ROOT_USERNAME} \
        -p ${MONGO_INITDB_ROOT_PASSWORD} \
        --authenticationDatabase admin \
        --eval "db.createUser({user: '${MONGODB_USER}', pwd: '${MONGODB_PASSWORD}', roles:[{role:'readWrite', db: '${MONGODB_DB}'}]});"

