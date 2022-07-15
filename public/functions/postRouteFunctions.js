const pool =  require("../models/db")

async function vrp(req,res){
    try {
        const query =
          "INSERT INTO VPRP (name,secondName,gender,religion,community,education,jobcardno,address,email,mobile,bankName,accountNumber,ifsc,pan,status,nativepanchayat,block,district,userID) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)";
        if(req.body.email==null || req.body.email===undefined){
          req.body.email=""
        }
        var values = Object.values(req.body);
        values.push(req.user.id);
        const result = await pool.query(query, values);
        res.json({ code: "200" });
      } catch (e) {
        console.log(e);
        res.json({ code: e.code });
      }
}

async function actionDetails(req,res){
    try {
        var arr = createDataAction(req.body);
        const basicID = req.body.basicID;
        const nickname = req.body.basicNickname;
        const userID = req.user.id;
        const count = req.body.count;
        for (var i = 0; i < count; i++) {
          const query =
            "INSERT INTO ACTION (paraNo,issueNo,dateofhlc,proceedingNumber,proceedingDate,totalamount,AmountRecovered_sgs,AmountRecovered_hlc,BasedOnDocument,TokenRecovery,basicID,basicnickname,userID) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)";
          const query2 = "SELECT * FROM ISSUE WHERE para_no=$1 and basicid=$2"
          const query3 = "SELECT * FROM ACTION WHERE paraNo=$1 and basicid=$2"
          const values2 = [arr[i].paraNo,basicID];
          const result2 =  await pool.query(query2,values2);
          if(result2.rowCount===0) throw "404";
          const result3 = await pool.query(query3,values2);
          if(result3.rowCount!==0) throw "300";

          var values = Object.values(arr[i]);
          values.push(basicID);
          values.push(nickname);
          values.push(userID);
          const result = await pool.query(query, values);
        }
    
        res.json({ code: "200" });
      } catch (e) {
        console.log(e);
        if (e.code) {
          res.json({ code: e.code });
        } else {
          res.json({ code: e });
        }
      }
}

function createDataAction(data) {
    const arr = [];
    for (var i = 0; i < data.count; i++) {
      const k1 = "paraNo" + i;
      const k2 = "issueno" + i;
      const k3 = "dateofhlc" + i;
      const k4 = "proceedingNumber" + i;
      const k5 = "proceedingDate" + i;
      const k6 = "totalamount" + i;
      const k7 = "AmountRecovered(sgs)" + i;
      const k8 = "AmountRecovered(hlc)" + i;
      const k9 = "BasedOnDocument" + i;
      const k10 = "TokenRecovery" + i;
      const obj = {
        paraNo: data[k1],
        issueNo: data[k2],
        dateofhlc: data[k3],
        proceedingNumber: data[k4],
        proceedingDate: data[k5],
        totalamount: data[k6],
        AmountRecoveredsgs: (data[k7]===""?0:data[k7]),
        AmountRecoveredhlc: (data[k8]===""?0:data[k8]),
        BasedOnDocument: (data[k9]===""?0:data[k9]),
        TokenRecovery: (data[k10]===""?0:data[k10]),
      };
      arr.push(obj);
    }
    return arr;
}

async function issueDetails(req,res){
    try {
        const arr = createDataIssue(req.body);
        const basicID = req.body.basicID;
        const nickname = req.body.basicNickname;
        const count = req.body.count;
        console.log(req.body);
        for (var i = 0; i < count; i++) {
          const query =
            "INSERT INTO ISSUE (issueType,issueCategory,issueSubCategory,para_no,issue_no,amount,issueStatus,userID,basicID,basicnickname) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
          const values = Object.values(arr[i]);
          values.push(req.user.id);
          values.push(basicID);
          values.push(nickname);
          const result = await pool.query(query, values);
        }
        res.json({ code: "200" });
      } catch (e) {
        console.log(e);
        res.json({ code: e.code });
      }
}

function createDataIssue(data) {
    const arr = [];
    for (var i = 0; i < data.count; i++) {
      const k1 = "issueType" + i;
      const k2 = "issueCategory" + i;
      const k3 = "issueSubCategory" + i;
      const k4 = "parano" + i;
      const k5 = "issue_no" + i;
      const k6 = "amount" + i;
      const k7 = "issueStatus" + i;
      const obj = {
        issueType: data[k1],
        issueCategory: data[k2],
        issueSubCategory: data[k3],
        parano: data[k4],
        issue_no: (data[k5]===""?0:data[k5]),
        amount: data[k6],
        issueStatus: data[k7],
      };
      arr.push(obj);
    }
    return arr;
}


async function basicInfo(req,res){
    try {
        const files = req.files;
        var images = [];
        var ids = [];
        const query =
          "INSERT INTO BASIC_INFORMATION (nickname,state,district,block,panchayat,startDate,endDate,GSDate,expenditureyear,auditedyear,roundnumber,SAPFromDate,SAPtoDate,UWRGbyIA,SWRGbyIA,MRGbyIA,TRGbyIA," +
          "numberOfWorks,worksVerified,houseHoldsWorked,houseHoldsVerified,noOfpeopleinGS,noofdaysworked,perdaywages,honorariumExpenses,travelExpenses,p_p_b_Expenses,videoExpenses,otherExpenses,totalExpenses,vrpIDs,userID,images)" +
          "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33)";
        var values = Object.values(req.body);
        ids = values.pop();
        if (ids == null || ids === "") {
          ids = [];
        } else {
          ids = ids.split(",");
        }
        values.push(ids);
        values.push(req.user.id);
        files.forEach((data) => {
          images.push(data.path);
        });
        values.push(images);
        const result = await pool.query(query, values);
        res.json({ code: "200" });
      } catch (e) {
        console.log(e);
        res.json({ code: e.code });
      }
}
module.exports = {vrp,actionDetails,issueDetails,basicInfo}