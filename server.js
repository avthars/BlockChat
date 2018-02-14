const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
var cors = require('cors');
const app = express();

app.use(cors())
app.use(express.static('./public/build'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve('./public/build', 'index.html'));
});

app.listen(port);
console.log('Server started running on port: ' + port);