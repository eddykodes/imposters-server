# Imposters (Server)

Imposters is the fun party game where you answer questions about yourself and see how well your friends know you. Each turn a target is chosen and is asked a question. You as an imposter have to try to impersonate your target and fool the other imposters into picking your answer. Fool all your friends to become the ultimate Imposter!

[Play the Game](https://imposters-game.herokuapp.com/)  
By [Eddy Ko](https://eddyko.com/)

## Built On

[Socket.IO](https://socket.io/) - a realtime engine for websockets.  
[NodeJS](https://nodejs.org/) - backend javascript runtime environment used to power server.  
[Express](https://expressjs.com/) - web framework for NodeJS.  
[Heroku](https://www.heroku.com/) - deployment service.  

Note: This repository only consists of the server and requires the frontend for usability. To view the frontend client, please refer to the following [repository](https://github.com/eddykodes/imposters-app).

## Getting Started

1. Clone repository client to a local machine user:
```shell
git clone https://github.com/eddykodes/imposters-server
```
2. Run the app in development mode:
```shell
node index.js
```
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

## Deployment

The Imposters server is currently deployed through heroku using [NodeJS](https://nodejs.org/) to allow for automated deployment through the main git branch.
