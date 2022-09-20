const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const messageRouter = require('./routes/messagesRoute');
const socket = require('socket.io');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
dotenv.config();
var store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: 'mySessions'
});

app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.set("trust proxy", 1);
app.use(session({
    name: "sessid",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
        // domain: '.mylittlecode.vercel.app',
        // sameSite: "none",
        // secure: true,
        // httpOnly: false,
    },
}))
app.use(express.json());

app.use("/api/auth", userRoutes)
app.use("/api/messages", messageRouter)

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err.message);
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
})

global.repositories = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-repo", (repoId) => {
        repositories.set(repoId, socket.id);
    });
    socket.on("send-msg", (data) => {
        const messageTo = data.message.repoId;
        const sendRepoSocket = repositories.get(messageTo);
        if (sendRepoSocket) {
            socket.to(sendRepoSocket).emit("msg-recieve", data.message)
        }
    })
})