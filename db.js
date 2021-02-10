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

const getUsers = (req, res) => {
  let getUsersSQL = "select * from users";
  pool.query(getUsersSQL, (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results);
    res.status(200).json(results.rows);
  });
};
const createUser = (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  let createUserSQL = "insert into users (email, name) values ($1, $2)";
  pool.query(createUserSQL, [email, name], (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results);
    res.status(200).json(results);
  });
};
const deleteUser = (req, res) => {
  const name = req.body.name;
  let deleteUserSQL = "delete from users where name = $1";
  pool.query(deleteUserSQL, [name], (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results);
    res.status(200).json(results);
  });
};
const updateUser = (req, res) => {
  const name = req.body.name;
  const id = req.body.id;
  let updateUserSQL = "update user set name = $1 where id = $1";
  pool.query(updateUserSQL, [name, id], (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results);
    res.status(200).json(results.rows);
  });
};

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
};
