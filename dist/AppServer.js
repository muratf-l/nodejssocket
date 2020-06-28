"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appserver = void 0;
const http = require("http");
const websocket = require("websocket");
const Player_1 = require("./Player");
const GameHost_1 = require("./GameHost");
const Database_1 = require("./Database");
class AppServer {
    constructor() {
        this.players = {};
        this.isDebug = false;
        this.host = new GameHost_1.default();
        this.config = require('./config.json')[process.env.NODE_ENV || 'development'];
        if (process.env.NODE_ENV !== 'production') {
            this.isDebug = true;
        }
        Database_1.database.init(this.config);
        this.createServer();
    }
    static bootstrap() {
        if (!this.appServerInstance) {
            this.appServerInstance = new AppServer();
            return this.appServerInstance;
        }
        else {
            return this.appServerInstance;
        }
    }
    log(message) {
        if (this.isDebug)
            console.log("[AppServer]", "     ", message);
    }
    PlayerAdd(player) {
        this.players[player.connectionId] = player;
        // let count = _.size(this.players);
        // this.log(`PlayerAdd Player Count: ${count}`);
    }
    PlayerRemove(connectionId) {
        delete this.players[connectionId];
        // let count = _.size(this.players);
        // this.log(`PlayerRemove Player Count: ${count}`);
    }
    createServer() {
        this.server = http.createServer();
        this.server.listen(this.config.Port);
        this.server.on('listening', () => {
            let address = this.server.address();
            let bind = (typeof address === 'string') ? `pipe ${address}` : `port ${address.port}`;
            this.log(`Listening on ${bind}`);
        });
        this.server.on('error', (error) => {
            if (error.syscall !== 'listen')
                throw error;
            console.error(error);
            process.exit(1);
        });
        this.wsServer = new websocket.server({
            httpServer: this.server
        });
        this.wsServer.on('request', function (request) {
            const connection = request.accept(null, request.origin);
            let player = new Player_1.default(connection);
            exports.appserver.PlayerAdd(player);
            connection.on('close', function (reasonCode, description) {
                player.OnWsDisconnected(reasonCode, description);
                exports.appserver.PlayerRemove(player.connectionId);
            });
            connection.on('message', function (message) {
                if (message.type !== 'utf8') {
                    return;
                }
                player.OnWsReceived(message.utf8Data);
            });
        });
    }
}
exports.appserver = AppServer.bootstrap();
