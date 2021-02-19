const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db');

app.use(express.urlencoded({extended: false}))

//api for the client (browser)
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("db connected");
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static("./views"));

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (request, response) => {
        response.render('newuser');
})
app.get("/userlisting", (request, response) => {
db.getUsers()
        .then((data) => {
                response.render("userlisting", { user: data.rows })
        }
)
});

app.get("/edituser", (request, response) => {
db.getOneUser(request, response).then((data) => {
        response.render('edituser', { data: data.rows[0] })
});
});

app.get("/searchName", (request, response)=>{
        const searchReq = String(request.query.search);

  db.searchUsers(searchReq).then((data) => {
          response.render("userlisting", { user: data.rows});
  })
  

})
app.get("/sortNameAsc", (request, response)=>{
 db.getSortedUsers("asc")
 .then((data) => {
         response.render("userlisting", {
                 users: data.rows,
         });
 })
 .catch(console.error);

})
app.get("/sortNameDes", (request, response)=>{
  db.getSortedUsers("desc")
  .then((data) => {
          response.render("userlisting", {
                  users: data.rows,
          })
  })
.catch(console.error);
})

app.post("/create", (request, response) => {
const requestBody = req.body;
  if (!users.firstName || !users.lastName || !users.email || !users.age) {
    response.redirect("/");
  }
  db.createUser(request, response).then(() => {
          response.redirect("userlisting")
  });
});
app.post("/updateUser", (request, response) => {
 db.updateUser(request, response).then(() => {
         response.redirect("userlisting")
 });
});
app.post("/deleteUser", (request, response) => {
        db.deleteUser(request, response).then(() =>{
                response.redirect("userlisting")
        });
});


app.listen(port, () =>{
        console.log(`App listening on port: ${port}`)
})