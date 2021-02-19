//api to the database
const Pool = require("pg-pool");
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
const pool = new Pool(config);
let client
const createTable = `
CREATE TABLE IF NO EXISTS users (
  id serial PRIMARY KEY,
  guid(36),
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
const createUser = (req, res) => {
  const guid = uuidv4();
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const age = req.body.age

  let createUserSQL = "insert into users (guid, firstName, lastName, email, age) values ($1, $2, $3, $4, $5)";
  return new Promise((resolve, reject) =>{
    pool.query(createUserSQL, [guid, firstName, lastName, email, age], (err, results) => {
      if (err) {
        reject (err);
        resolve(results)
      }
    });
  })
};
const deleteUser = (req, res) => {
  const guid = req.headers.userid;
  let deleteUserSQL = "delete from users where guid = $1";
  return new Promise(( resolve, reject) =>{

    pool.query(deleteUserSQL, [guid], (err, results) => {
      if (err) {
        reject (err);
        resolve (results);
      }
    });
  })
};
const updateUser = (req, res) => {
  const id = req.body.id;
  const firstName = req.body.name;
  const lastName = req.body.name;
  const email = req.body.email;
  const age = req.body.age;

  let updateUserSQL = "update users set guid = $1, firstname = $2, lastName = $3, email = $4, age = $5 ";
  return new Promise((resolve, reject) =>{
    
    pool.query(updateUserSQL, [id, firstName, lastName, email, age], (err, results) => {
      if (err) {
        reject (err);
        resolve(results)
      }
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
  let sortSQL =  ` select * from users order by firstName ${sortDirection}`;
  return new Promise((resolve, reject) =>{
    pool.query(sortSQL, (err, results) =>{
      if (err)
      reject(err)
      resolve(results)
    })
  }) 
};
const searchUsers = (searchReq)=>{
  let searchSQL = "select firstName, lastName from users where firstName = $1 or lastName = $1";
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
