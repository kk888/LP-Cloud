Authorship: Kaho Kui
Environment: Ubuntu 16.04.4 LTS
(Local) Software Versions: node v8.12, docker v18.09.0, docker-compose v1.21.2

This project contains code pertaining to the LP-Cloud LPaaS

### Requisites:

1. Docker v18.09 or above
2. Docker-Compose v1.21.2 or above

### Setup Instructions:

#### Local
1. npm install
2. npm start

#### Docker Container

###### 1.Download code

###### 2.Update config/default.json uri for various configurations
The json file currently configures port number

###### 3.Run
```sh
sudo docker-compose up -d
```

###### 4.Test
project runs at http://[ServerAddress]:3000/


