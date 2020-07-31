# twitter-scrapper
Simple scrapper using twitter api 

Simple twitter scrapper service using Twitter search API

Prerequirements:
  1. Docker
  2. make
  
  
**How it works:**
  It is simple scrapping service using Twitter search API. It consists from 2 continers: application and database(Mongodb).  
**How to Start**  
For running the service:  
  Simple:
  1. Add in .env file the BEARER_TOKEN `TWITTER_BEARER_TOKEN=your bearer token`
  2. Just run `make run`
  
  Optionaly advenced:
    The database path `DB_PATH` by default is in `./mongodb` and mounted to container. It is possible to overwrite by doing `make run DB_PATH=your path to db`  
    Same is with logs `LOG_PATH` by default is in `./logs` which is also mounted in containers(db and app). It is possible to overwrite by doing `make run LOG_PATH=your path to logs`
    
 Other useful commands:  
    `make stop` stopping the containers  
    `make clean` stopping and deleting stopped and dangling containers  
  
  
 **THE API**
 
 TOPICS:  
  `GET /api/topics` returns the existing topics  
  `POST /api/topics` body: `{name: 'topic name'}` adds the topic to existing. The next iteration of scrapping would be considered new topic as well.  
  `GET /api/topics/:_id` returns specified topic  

TWEETS:  
  `GET /api/tweets/` path parameters:  
      1. `limit` max number of tweets to return. The maximum count of tweets to retrieve is 100.  
      2. `topic_id` the `ObjectId string`.  
      3. `max_id` to get tweets with lesser than specified id  
      4. `since_id` to get tweets greater than specified id  
      5. `sort` sorting order 1 is ascending -1 is descending  
   `GET /api/tweets/count` return aggregated tweets counts by topic 
