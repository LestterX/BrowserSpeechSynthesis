import express, { Router } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import cors from 'cors'


const routes = Router()
routes.get('/', (req, res) => { res.send('Testandooo') })

const app = express();
app.use(cors({ origin: '*' }))
app.use(express.static(path.resolve('public')))
app.use(routes)


const httpServer = createServer(app);
const io = new Server(httpServer, {});

let usersCounter = 0

io.on("connection", (socket) => {
    socket.on('disconnect', () => {
        console.log('Desconnected: ', socket.id);
        usersCounter = usersCounter - 1
        io.emit('userOut', usersCounter)
    })
    usersCounter = usersCounter + 1
    io.emit('userEnter', usersCounter)
    socket.on('bntFalarPress', (userInputMsg, userName) => {
        console.log(userInputMsg, ' user');
        console.log(`[User-${userName}] disse: \n${userInputMsg}`);
        socket.broadcast.emit('bntFalarPress', userInputMsg, userName)
    })
});


httpServer.listen(3350, () => { console.log('Server running on: http://localhost:3350'); });