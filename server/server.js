const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('src'));
app.use('/public', express.static('public'));

io.on('connection', socket => {
  console.log('A user connected');
});

http.listen(3000, () => {
  console.log('Listening on *:3000');
});
