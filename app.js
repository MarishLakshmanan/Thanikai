require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./public/models/db");
const multer = require("multer");
const Sib = require('sib-api-v3-sdk')
const Razorpay = require("razorpay");
const jwt = require("jsonwebtoken");
const path = require("path");

const {
  getBasicInfoVprp,
  getBasic,
  getAll,
  getIssueId,
  getIssues,
  getAllVprp,
  getActions,
} = require("./public/functions/getRouteFunctions");
const {
  checkAtoken,
  checkRtoken,
  logoutUser,
  loginUser,
  registerUser,
  checkSubscription
} = require("./public/functions/authorization");
const {
  vrp,
  actionDetails,
  issueDetails,
  basicInfo,
} = require("./public/functions/postRouteFunctions");
const {
  updateData,
  deleteData,
} = require("./public/functions/putAndDeleteRoute");
const bcrypt = require("bcrypt");
const { log } = require("console");
const { loadavg } = require("os");
const PORT = 5000 || process.env.PORT;

app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE_API
const tranEmailApi = new Sib.TransactionalEmailsApi()
const sender = {
  email: 'buzz.live2022@gmail.com',
  name: 'Thanikai',
}

const fileStorgaeEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: fileStorgaeEngine });

app.use(upload.array("images", 4));

if (process.env.NODE_ENV === "production") {
  //server static content
  //npm run build
  app.use(express.static(path.join(__dirname, "frontend/build")));
}



app.get("/get-basicinfo-vprp", checkAtoken,checkSubscription, getBasicInfoVprp);
app.get("/get-basic", checkAtoken,checkSubscription, getBasic);
app.get("/get-all", checkAtoken,checkSubscription, getAll);
app.get("/get-issue/:id", checkAtoken,checkSubscription, getIssueId);
app.get("/get-issues", checkAtoken,checkSubscription, getIssues);
app.get("/get-all-vprp", checkAtoken,checkSubscription, getAllVprp);
app.get("/get-actions", checkAtoken,checkSubscription, getActions);

app.get("/dashboard", checkAtoken,checkSubscription, async (req, res) => {
  try {
    const userID = req.user.id;
    var query = "select name,email,phone,subscription_start,subscription_end from users where id=$1";
    const value = [userID];
    var result = await pool.query(query, value);
    var finalData = getUserDetails(result.rows);


    //Getting Data
    var queries = [
      "select count(id) from vprp where userid=$1",
      "select count(id) from basic_information where userid=$1",
      "select basicnickname from issue where userid=$1",
      "select basicnickname from action where userid=$1",
    ];
    var name = ["VPRP", "Basic information", "Issue", "Action"];
    var countData = [];
    for (var i = 0; i < queries.length; i++) {
      result = await pool.query(queries[i], value);
      var obj = {};
      
      if(i>1){
        obj.count=result.rowCount;
        obj.name=name[i];
        var arr = [];
        result.rows.map((value)=>{
          arr.push(value.basicnickname)
        })
        if(arr){
          arr.sort();
        }
        var data=[],labels=[],curr=null,count;
        for(var j=0;j<arr.length;j++){
          if(curr==null){
            curr=arr[j];
            count=1;
          }else if(curr===arr[j]){
            count++;
          }else if(curr!==arr[j]){
            labels.push(curr);
            data.push(count);
            curr=arr[j];
            count=1;
          }
        }
        labels.push(curr);
        data.push(count);

        obj.data=data;
        obj.label=labels;
      }else{
        obj.count=result.rows[0].count;
        obj.name=name[i];
        obj.label=[name[i]];
        obj.data=[result.rows[0].count];
      }

      countData.push(obj);
    }
    finalData.push(countData);

    //getting Count

    queries = ["select basicnickname,amount from issue where userid=$1",
    "select basicnickname,totalamount as amount from action where userid=$1",
    "select nickname as basicnickname,totalexpenses as amount from basic_information where userid=$1"
    ]
    name=["Issue Expenses","Action Taken Expenses","Basic Expenses"]

    var amountData=[];

    for(var i=0;i<queries.length;i++){
      result = await pool.query(queries[i],value);
      var obj={};
      var temp = result.rows;
      temp.sort((a,b) => (a.basicnickname > b.basicnickname) ? 1 : ((b.basicnickname > a.basicnickname) ? -1 : 0))
      var data=[],label=[],curr=null,amount;
      for(var j=0;j<temp.length;j++){
        if(curr==null){
          curr=temp[j].basicnickname;
          amount=temp[j].amount;
        }else if(curr===temp[j].basicnickname){
          amount+=temp[j].amount;
        }else{
          data.push(amount);
          label.push(curr);
          curr=temp[j].basicnickname;
          amount=temp[j].amount;
        }
      }
      data.push(amount);
      label.push(curr);

      obj.data=data;
      obj.label=label;
      obj.name=name[i]

      amountData.push(obj);
    }

    finalData.push(amountData)

    res.json({ code: "200", data: finalData });
  } catch (e) {
    console.log(e);
  }
});

function getUserDetails(data){
  function getDate(d1,d2){
    return parseInt(((new Date(d2))- (new Date(d1)) )/ (1000 * 60 * 60 * 24), 10)
  }
  data[0].totalDays=getDate(data[0].subscription_start,data[0].subscription_end)
  data[0].daysPassed=getDate(data[0].subscription_start,(new Date()))
  data[0].daysLeft=getDate((new Date()),data[0].subscription_end)
  return data;
}

app.get("/images/:id", getImages);
app.get("/checkAtoken", checkAtoken, (req, res) => {
  res.json({ code: "200" });
});
app.get("/checkRtoken", checkRtoken);
app.post("/registerUser", registerUser);
app.post("/loginUser", loginUser);

app.post("/vrp", checkAtoken,checkSubscription, vrp);
app.post("/action-details", checkAtoken,checkSubscription, actionDetails);
app.post("/issue-details", checkAtoken,checkSubscription, issueDetails);
app.post("/basic-info", checkAtoken,checkSubscription, basicInfo);

app.post("/change-password", checkAtoken, async (req, res) => {
  try {
    const userID = req.user.id;
    var query = "SELECT password from users where id=$1";
    var value = [userID];
    var result = await pool.query(query, value);
    const password = result.rows[0].password;
    const authenticated = await bcrypt.compare(req.body.pass, password);
    if (!authenticated) throw "404";
    const hash = bcrypt.hashSync(
      req.body.pass1,
      parseInt(process.env.SALT_ROUNDS)
    );
    query = "UPDATE users SET password=$1 WHERE id=$2";
    value = [hash, userID];
    //const result = await pool.query(query,value)
    res.json({ code: "200" });
  } catch (e) {
    console.log(e);
    if (e.code) {
      res.json({ code: e.code });
    } else {
      res.json({ code: e });
    }
  }
});

app.post("/change-details", checkAtoken, async (req, res) => {
  try {
    const userID = req.user.id;
    var query = "UPDATE users SET name = $1, phone = $2, email=$3 WHERE id=$4";
    var values = [req.body.name, req.body.phone, req.body.email, userID];
    const result = await pool.query(query, values);
    res.json({ code: "200" });
  } catch (e) {
    console.log(e);
    if (e.code) {
      res.json({ code: e.code });
    } else {
      res.json({ code: e });
    }
  }
});

app.post("/get-orderid", checkAtoken, async (req, res) => {
  try {
    const userID = req.user.id;
    var query = "SELECT subscription from users WHERE id=$1";
    var values = [userID];
    const result = await pool.query(query,values);
    //202  means subsciption already exists
    const subscription = result.rows[0].subscription
    if(subscription) return res.json({code:"202"});
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    var options = {
      amount: (req.body.amount), // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    instance.orders.create(options, async (err, order) => {
      try{
      query = "INSERT INTO orderids (order_id) VALUES ($1)";
      values = [order.id];
      const result = await pool.query(query, values);
      res.json({ code: "200", data: order.id });
      }catch (e){
        console.log(e);
      }
      
    });
  } catch (e) {
    console.log(e);
    res.json({code:e.code})
  }
});

app.post("/payment-verify",async (req,res)=>{
  try{
    const {month,email,razorpay_payment_id,order_id,razorpay_signature} = req.body.response;
    let body=order_id + "|" + razorpay_payment_id;

    Date.isLeapYear = function (year) { 
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
  };
  
  Date.getDaysInMonth = function (year, month) {
      return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  };
  
  Date.prototype.isLeapYear = function () { 
      return Date.isLeapYear(this.getFullYear()); 
  };
  
  Date.prototype.getDaysInMonth = function () { 
      return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
  };
  
  Date.prototype.addMonths = function (value) {
      var n = this.getDate();
      this.setDate(1);
      this.setMonth(this.getMonth() + value);
      this.setDate(Math.min(n, this.getDaysInMonth()));
      return this;
  };

    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
                                    .update(body.toString())
                                    .digest('hex');
    var response = {code:"201"}
    if(expectedSignature === razorpay_signature){

      response={code:"200"}
      let subscription = "t";
      let subscription_start = new Date();      
      let subcription_end = new Date();
      subcription_end.addMonths(Number(month))
      var query = "UPDATE users SET subscription=$1, subscription_start=$2, subscription_end=$3 WHERE email=$4";
      var values = [subscription,subscription_start,subcription_end,email];
      const result = await pool.query(query,values);
    }
    
    res.json(response);
      
  }catch(e){
    console.log(e);
    if(e.code){
      res.json({code:e.code})
    }else{
      res.json({code:e})
    }
  }
  

})

app.post("/forgot-password",async (req,res)=>{
  try{
  const email = req.body.email;
  let query = "SELECT * FROM users WHERE email like $1";
  let value = [email];
  let result = await pool.query(query,value);
  if(result.rowCount>0){
    const user = result.rows[0];
    const secret =process.env.RESET_SECRET+ user.password;
    const payload = {id:user.id,email:user.email}
    const token = jwt.sign(payload,secret,{expiresIn :"15m"});
    const resetlink = `http://localhost:3000/reset-password/${user.id}/${token}`;

    const receivers = [
      {
          email: user.email,
      },
    ]

  tranEmailApi
    .sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Password reset link',
        textContent: `Here is your password reset link ${resetlink}`,
        htmlContent: `<h1>Here is your Reset link</h1> <p>${resetlink}</p>`,
        params: {
            role: 'Frontend',
        },
    })
    .then((result)=>{
      console.log(result)
      res.json({code:"200"})
    })
    .catch((err)=>{
      console.log(err);
      res.json({code:"3242"})
    })

    
    

  }else{
    res.json({code:"404"})
  }}
  catch(e){
    res.json({code:e.code})
  }
})

app.post("/reset-password",async (req,res)=>{
  try{
    const id = req.body.id;
    const token = req.body.token;
    const password = req.body.password;

    let query = "select * from users where id=$1"
    let value = [id];
    let result = await pool.query(query,value);
    if(result.rowCount>0){
      const user =  result.rows[0];
      const secret =process.env.RESET_SECRET+ user.password;
      const payload = jwt.verify(token,secret);
      const hash = bcrypt.hashSync(
        password,
        parseInt(process.env.SALT_ROUNDS)
      );
      query = "UPDATE users SET password=$1 WHERE id=$2"
      value=[hash,id];
      result = await pool.query(query,value);
      res.json({code:"200"})
    }else{
      res.json({code:"404"})
    }
  }catch(e){
    console.log(e);
    res.json({code:e.code})
  }
})

app.post("/send-message",(req,res)=>{
  let {name,message,mail} = req.body;

  const receiver = [
    {
        email: process.env.OWNER_MAIL,
    },
  ]

  tranEmailApi
    .sendTransacEmail({
        sender,
        to: receiver,
        subject: 'You got a Message from one of your user',
        textContent: `${name},   ${mail},   ${message}`,
        htmlContent: `<h1>${name}</h1> <h2>${mail}</h2> <p>${message}</p>`,
        params: {
            role: 'Frontend',
        },
    })
    .then((result)=>{
     
      res.json({code:"200"})
    })
    .catch((err)=>{
      
      res.json({code:"3242"})
    })

})
app.put("/update-data", checkAtoken, updateData);

app.delete("/delete-data", checkAtoken, deleteData);
app.delete("/logout", logoutUser);

async function getImages(req, res) {
  const params = req.params.id;
  res.sendFile(__dirname + "\\images\\" + params);
}

app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname, "client/build/index.html"));
})

app.listen(PORT, () => {
  console.log("Server is running");
});


//CODE FOR GETTING BASIC INFORMATION
// select 

//     b.district,b.block,b.panchayat,b.startDate,b.id as basicid,
//     i.issueType,i.issueCategory,i.issueSubCategory,i.issue_no,i.para_no,i.amount,i.id as issueid,i.issueStatus,
//     a.proceedingNumber,a.proceedingDate,a.AmountRecovered_sgs,a.AmountRecovered_hlc,a.BasedOnDocument,a.TokenRecovery,a.id as actionid

// from issue as i
// join basic_information as b on i.basicid=b.id and b.userid=2
// left join action as a on i.para_no=a.paraNo and a.userid=2;