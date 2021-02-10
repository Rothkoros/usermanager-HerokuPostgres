const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
console.log(` app name = ${process.env.APP_NAME}`);
console.log(`title = ${process.env.title}`);

app.use(express.urlencoded({extended: false}))

//api for the client (browser)
app.get('/users', (req, res) =>{
        res.send('all users')
});
app.post('/createUser', (req, res) =>{
        res.send('new user created');
})


app.listen(port, () =>{
        console.log(`App listening on port: ${port}`)
})