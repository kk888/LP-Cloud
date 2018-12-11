Authorship: Kaho Kui

Environment: Ubuntu 16.04.4 LTS

(Local) Software Versions: node v8.12, docker v18.09.0, docker-compose v1.21.2

This project contains code pertaining to the LP-Cloud LPaaS

### Requisites:

1. Docker v18.09 or above
2. Docker-Compose v1.21.2 or above

### Setup Instructions:

### Docker Install Instruction
Find the instructions for your operating system
https://docs.docker.com/install/

### Docker Compose Install Instruction
https://docs.docker.com/compose/install/

#### Local without Docker
1. npm install
2. npm start

#### Docker Container

###### 1.Download code

###### 2.Update config/default.json uri for various configurations
The json file currently configures port number

###### 3.Run
```sh
cd LP_directory
sudo docker-compose up
```

###### 4.Test
project runs at http://[ServerAddress]:3000/


