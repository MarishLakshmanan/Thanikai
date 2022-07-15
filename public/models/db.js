const {Pool}= require("pg");
require("dotenv").config();


// const pool = new Pool({
//     user:process.env.P_USER,
//     password:process.env.P_PASS,
//     host:process.env.P_HOST,
//     database:process.env.P_BASE,
//     port:process.env.P_PORT
// })

const devConfig = `postgresql://${process.env.P_USER}:${process.env.P_PASS}@${process.env.P_HOST}:${process.env.P_PORT}/${process.env.P_BASE}`;

const proConfig = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString:
      process.env.NODE_ENV === "production" ? proConfig : devConfig,
      ssl: false
  });

module.exports = pool;


// ssl: {
//   rejectUnauthorized: false
// }