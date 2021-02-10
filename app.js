const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db');
console.log(` app name = ${process.env.APP_NAME}`);
console.log(`title = ${process.env.title}`);

app.use(express.urlencoded({extended: false}))

//api for the client (browser)
app.get('/users', db.getUsers);
app.post('/createUser', (db.createUser))


app.listen(port, () =>{
        console.log(`App listening on port: ${port}`)
})