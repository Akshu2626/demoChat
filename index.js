// const express = require('express');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');


const app = express();

app.use(cors('https://chatapplication-orcin.vercel.app/'));

// CORS मिडलवेयर सेटअप


const allowedOrigins = ['http://localhost:4000', 'https://chatapplication-orcin.vercel.app/'];



const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: 'http://localhost:3000',
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  }
});

app.use(cors(cors));


io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
