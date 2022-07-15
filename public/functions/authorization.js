const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../models/db")

function checkAtoken(req, res, next) {
  console.log("Checking access token");
    const authHeader = req.headers["authorization"];
    const token = authHeader.slice(7);
    if (token == null) return res.json({ code: "204" });
    //204 means token is empty
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) {
        console.log(err);
        return res.json({ code: "401" });
      }
      req.user = user;
      next();
    });
}

async function checkSubscription(req,res,next){
  try{
  console.log("Checking subscription");
  const userID = req.user.id;
  var query = "SELECT subscription,subscription_end FROM users WHERE id=$1";
  var values = [userID];
  const result = await pool.query(query,values);
  const data = result.rows[0];
  if(data.subscription){
    const today = new Date();
    if(today.getTime()===data.subscription_end || today>data.subscription_end){
      console.log("In here 2");
      //failure
      query = "UPDATE users SET subscription=$1 WHERE id=$2";
      values=["f",userID];
      await pool.query(query,values);
      //402 means no subscription
      return res.json({code:"402"});
    }
    next();
  }else{
    console.log("In Here");
    return res.json({code:"402"})
  }
  console.log(data);
  }catch(e){
    console.log(e);
  }
}



async function checkRtoken(req, res) {
  console.log("Checking Refresh token");
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader.slice(7);
      if (token == null) return res.json({ code: "204" });
      const result = await pool.query("SELECT token FROM tokens WHERE token=$1", [
        token,
      ]);
      if (result.rowCount === 0) throw "403";
      //403 means invalid token
      jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) {
          console.log(err);
          throw "401";
        }
  
        //401 means refresh token expired ask the user to login again
        const payload = {
          name: user.name,
          email: user.email,
          id: user.id,
        };
        const atoken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
          expiresIn: "30m",
        });
        return res.json({ code: "200", atoken: atoken });
      });
    } catch (e) {
      console.log(e);
      if (e.code) {
        res.json({ code: e.code });
      } else {
        res.json({ code: e });
      }
    }
  }

  async function logoutUser(req, res) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader.slice(7);
      if (!token) throw "204";
      const query = "DELETE FROM tokens WHERE token=$1";
      const value = [token];
      await pool.query(query, value);
      res.json({ code: "200" });
    } catch (e) {
      console.log(e);
      if (e.code) res.json({ code: e.code });
      res.json({ code: e });
    }
  }

  
  async function loginUser(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;  
      const query = "SELECT * FROM users WHERE email=$1";
      const values = [email];
  
      const result = await pool.query(query, values);
      if (result.rowCount === 0) throw "404";
      const pass = result.rows[0].password;
      const name = result.rows[0].name;
      const subscription = result.rows[0].subscription;
      const id = result.rows[0].id;
  
      const authenticated = await bcrypt.compare(password, pass);
  
      if (authenticated) {
        const payload = { name: name, email: email, id: id };
        const atoken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
          expiresIn: "30m",
        });
        const rtoken = jwt.sign(payload, process.env.REFRESH_TOKEN);
        await pool.query("INSERT INTO tokens (token,email) VALUES ($1,$2)", [
          rtoken,
          email,
        ]);
        res.json({
          code: "200",
          atoken: atoken,
          rtoken: rtoken,
          subscription: subscription,
          name: name,
          email: email,
        });
      } else {
        res.json({ code: "403" });
      }
    } catch (e) {
      if (e === "404") res.json({ code: e });
      console.log(e);
      res.json({ code: e.code });
    }
  }

  async function registerUser(req, res) {
    try {
      const hash = bcrypt.hashSync(
        req.body.password,
        parseInt(process.env.SALT_ROUNDS)
      );
      const query =
        "INSERT INTO USERS (name,password,email,phone,subscription) VALUES ($1,$2,$3,$4,$5)";
      const values = [req.body.name, hash, req.body.email, req.body.phone, "f"];
      const response = await pool.query(query, values);
      res.json({ code: "200" });
    } catch (e) {
      console.log(e);
      if (e.code) {
        res.json({ code: e.code });
      } else {
        res.json({ code: e});
      }
    }
  }

module.exports = {checkAtoken,checkRtoken,logoutUser,loginUser,registerUser,checkSubscription};