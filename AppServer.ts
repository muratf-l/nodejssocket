import * as http from 'http';
import * as websocket from 'websocket';
import * as _ from "lodash";

import Player from './Player';
import GameHost from './GameHost';
import {database} from './Database'

class AppServer {

    private static appServerInstance: AppServer;

    private server: any;

    private wsServer: any;

    public config: any;

    private players: any = {};

    private readonly isDebug: boolean = false;

    public readonly host: GameHost = new GameHost();


    public static bootstrap(): AppServer {
        if (!this.appServerInstance) {
            this.appServerInstance = new AppServer();
            return this.appServerInstance;

        } else {
            return this.appServerInstance;
        }
    }

    private log(message): void {
        if (this.isDebug)
            console.log("[AppServer]", "     ", message)
    }

    public constructor() {
        this.config = require('./config.json')[process.env.NODE_ENV || 'development'];

        if (process.env.NODE_ENV !== 'production') {
            this.isDebug = true;
        }

        database.init(this.config)

        this.createServer();
    }

    private PlayerAdd(player: Player) {
        this.players[player.connectionId] = player;

        // let count = _.size(this.players);
        // this.log(`PlayerAdd Player Count: ${count}`);
    }

    private PlayerRemove(connectionId: string) {
        delete this.players[connectionId];

        // let count = _.size(this.players);
        // this.log(`PlayerRemove Player Count: ${count}`);
    }

    private createServer() {
        this.server = http.createServer();
        this.server.listen(this.config.Port);

        this.server.on('listening', () => {
            let address = this.server.address();
            let bind = (typeof address === 'string') ? `pipe ${address}` : `port ${address.port}`;
            this.log(`Listening on ${bind}`);
        });

        this.server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') throw error;
            console.error(error);
            process.exit(1);
        });

        this.wsServer = new websocket.server({
            httpServer: this.server
        });

        this.wsServer.on('request', function (request) {
            const connection = request.accept(null, request.origin);

            let player = new Player(connection);
            appserver.PlayerAdd(player)

            connection.on('close', function (reasonCode, description) {
                player.OnWsDisconnected(reasonCode, description)
                appserver.PlayerRemove(player.connectionId)
            });

            connection.on('message', function (message) {
                if (message.type !== 'utf8') {
                    return;
                }

                player.OnWsReceived(message.utf8Data);
            })
        });
    }
}

export const appserver = AppServer.bootstrap();