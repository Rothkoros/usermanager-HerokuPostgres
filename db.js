//api to the database
const {v4:uuidv4} = require("uuid")
const {Pool} = require("pg");
const url = require("url");
const dbConnectionString = process.env.DATABASE_URL;

const params = url.parse(dbConnectionString);

const auth = params.auth.split(":");
let SSL = process.env.SSL || { rejectUnauthorized: false };

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split("/")[1],
  ssl: SSL,
};
const pool = new Pool({
  connectionString:dbConnectionString, SSL: {rejectUnauthorized: false,}, ...config
});
let client
const createTable = `
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  guid char(36),
  firstName text,
  lastName text,
  email varchar(50),
  age int
)`;
const connectToDB = async () => {
  return new Promise((resolve, reject) => {
    pool.connect()
      .then((newClient) =>{
        client = newClient;
        resolve();
      })
      .catch(reject);
  })

}
connectToDB().then(() => {
  client.query(createTable).then(() => console.log("table found."));
});
const getUsers = (req, res) => {
  let getUsersSQL = "select * from users";
  return new Promise((resolve, reject) => {
    pool.query(getUsersSQL, (err, results) =>{
      if (err) reject(err);
      resolve(results)
    })
  })
  // pool.query(getUsersSQL, (err, results) => {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log(results);
  //   res.status(200).json(results.rows);
  // });
};
const createUser = (request, response) => {
  const guid = uuidv4();
  const firstName = request.body.firstName;
  const lastName = request.body.lastName;
  const email = request.body.email;
  const age = request.body.age

  let createUserSQL = "insert into users (guid, firstName, lastName, email, age) values ($1, $2, $3, $4, $5)";
  return new Promise((resolve, reject) =>{
    pool.query(createUserSQL, [guid, firstName, lastName, email, age], (err, results) => {
      if (err) {
        reject (err);
      }
      resolve(results)
    });
  })
};
const deleteUser = (request, response) => {
  const guid = request.headers.userid;
  let deleteUserSQL = "delete from users where guid = $1";
  return new Promise(( resolve, reject) =>{

    pool.query(deleteUserSQL, [guid], (err, results) => {
      if (err) {
        reject (err);
      }
      resolve (results);
    });
  })
};
const updateUser = (request, res) => {
  const guid = request.query.userid;
  const firstName = request.body.firstName;
  const lastName = request.body.lastName;
  const email = request.body.email;
  const age = request.body.age;

  let updateUserSQL = "update users set firstname = $1, lastName = $2, email = $3, age = $4 where guid = $5 ";
  return new Promise((resolve, reject) =>{
    
    pool.query(updateUserSQL, [firstName, lastName, email, age, guid], (err, results) => {
      if (err) {
        reject (err);
      }
      resolve(results)
    });
  })
};
const getOneUser = (req, res) =>{
  const guid = req.query.userid;
  let oneUserSQL = 
  "SELECT guid, firstName, lastName, email, age from users where guid = $1";
  return new Promise((resolve, reject) =>{
    pool.query(oneUserSQL, [guid], (err, results) => {
      if (err)
      reject(err);
      resolve(results)
    })
  })
};
const getSortedUsers = (sortDirection) => {
  let sortSQL =  `select * from users order by firstname ${sortDirection}`;
  return new Promise((resolve, reject) =>{
    pool.query(sortSQL, (err, results) =>{
      if (err)
      reject(err)
      resolve(results)
    })
  }) 
};

const searchUsers = (searchReq)=>{
  let searchSQL = "select firstname, lastname, email, age from users where firstname = $1 or lastname = $1";
  return new Promise((resolve, reject) =>{
    pool.query(searchSQL, [searchReq], (err, results) => {
      if (err)
      reject(err)
      resolve(results)
    })

  })
}

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getOneUser,
  getSortedUsers,
  searchUsers
};
