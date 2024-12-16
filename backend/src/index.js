import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';

import { PORT } from './config/serverConfig.js';

import { Server } from 'socket.io';
import { createServer } from 'node:http';

import chokidar from 'chokidar';
import { handleEditorSocketEvents } from './socketHandlers/editorHandler.js';

import { WebSocketServer } from 'ws';
import { handleContainerCreate, listContainer } from './containers/handleContainerCreate.js';
import { handleTerminalCreation } from './containers/handleTerminalCreation.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST'],
    }
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use('/api', apiRouter);

app.get('/ping', (req, res) => {
    return res.json({ message: 'pong' });
});

const editorNamespace = io.of('/editor');

editorNamespace.on('connection', (socket) => {
    console.log('Editor Connected');

    let projectId = socket.handshake.query['projectId'];

    console.log('Project id received after connection', projectId);

    if (projectId){
        var watcher = chokidar.watch(`/projects/${projectId}`, {
            ignored: (path) => {
                return path.includes('node_modules');
            },
            persistent: true,
            awaitWriteFinish: {
                stabilityThreshold: 2000
            },
            ignoreInitial: true
        });

        watcher.on('all', (event, path) => {
            console.log(event, path);
        })
    }

    socket.on('getPort', () => {
        console.log('getPort event received');
        listContainer();
    })

    handleEditorSocketEvents(socket, editorNamespace);

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const webSocketForTerminal = new WebSocketServer({
    noServer: true
})

webSocketForTerminal.on('connection', (ws, req, container) => {
    console.log('Terminal Connected');

    handleTerminalCreation(container, ws);

    ws.on('close', () => {
        container.remove({ force: true }, (err, data) => {
            if (err){
                console.log('Error while removing container', err);
            }
            console.log('Container removed', data);
        });
    })
})

server.on('upgrade', (req, tcpSocket, head) => {
    // When http connection is upgraded to web socket connection, an upgrade event is emitted which will be listened by server here 

    const isTerminal = req.url.includes('/terminal');

    if (isTerminal){
        console.log('Request URL received: ', req.url);
        const projectId = req.url.split('=')[1];
        console.log('Project ID received after connection: ', projectId);

        handleContainerCreate(projectId, webSocketForTerminal, req, tcpSocket, head);
    }
})
