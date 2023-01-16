
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');
const dotenv = require("dotenv");
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const corsOptions = {
    Credential: 'true',
}

const app = express();
app.use(express.json())
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser())
dotenv.config();

//server config
const http = require('http').createServer(app);
const io = require('socket.io')(http);
io.on('connection', socket => {
    SocketServer(socket);
})
//Routers 

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);




//mongose config
const URL = process.env.MONGODBURL;
mongoose.connect(URL).then(() => {
    console.log("DB is Connected")
}).catch(() => {
    console.log("DB is not Connected");
});


const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});