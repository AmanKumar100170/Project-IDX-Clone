import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';

import { PORT } from './config/serverConfig.js';

import { Server } from 'socket.io';
import { createServer } from 'node:http';
import { handleEditorSocketEvents } from './socketHandlers/editorHandler.js';

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

    handleEditorSocketEvents(socket, editorNamespace);

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});