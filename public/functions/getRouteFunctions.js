const pool = require("../models/db");

async function executeGetQuery(query, values, res) {
  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) throw "404";
    const data = result.rows;
    res.json({ code: "200", data: data });
  } catch (e) {
    console.log(e);
    if (e.code) {
      res.json({ code: e.code });
    } else {
      res.json({ code: e });
    }
  }
}

async function getBasicInfoVprp(req, res) {
  try {
    const userID = req.user.id;
    const query =
      "SELECT (name,mobile),id FROM VPRP WHERE userID=$1";
    const value = [userID];
    const result = await pool.query(query, value);
    if (result.rowCount === 0) throw "404";
    const vprp = result.rows;
    const query2 = "SELECT * FROM basic_information WHERE userID=$1";
    const result2 = await pool.query(query2, value);
    // if (result2.rowCount === 0) throw "404";
    const basic = result2.rows;
    res.json({ code: "200", data: { vprp: vprp, basic: basic } });
  } catch (e) {
    console.log(e);
    if (e.code) {
      res.json({ code: e.code });
    } else {
      res.json({ code: e });
    }
  }
}

async function getBasic(req, res) {
  const userID = req.user.id;
  const query = "SELECT id,nickname FROM BASIC_INFORMATION WHERE userID=$1";
  const value = [userID];
  executeGetQuery(query, value, res);
}

async function getAll(req, res) {
  const userID = req.user.id;
  const query =
    "select b.nickname,b.expenditureyear,b.auditedyear, b.district,b.block,b.panchayat,b.startDate,b.id as basicid,i.issueType,i.issueCategory,i.issueSubCategory,i.issue_no,i.para_no,i.amount,i.id as issueid,i.issueStatus,a.proceedingNumber,a.proceedingDate,a.totalamount,a.AmountRecovered_sgs,a.AmountRecovered_hlc,a.BasedOnDocument,a.TokenRecovery,a.id as actionid " +
    "from issue as i join basic_information as b on i.basicid=b.id and b.userid=$1 left join action as a on i.para_no=a.parano and a.userid=$1;";
  const values = [userID];
  executeGetQuery(query, values, res);
}

async function getIssueId(req, res) {
  const basicID = req.params.id;
  const userID = req.user.id;
  const query = "SELECT (para_no) FROM ISSUE WHERE userID=$1 AND basicID=$2";
  const values = [userID, basicID];
  executeGetQuery(query, values, res);
}

async function getIssues(req, res) {
  const userID = req.user.id;
  const query = "SELECT * FROM ISSUE WHERE userID=$1";
  const values = [userID];
  executeGetQuery(query, values, res);
}

async function getAllVprp(req, res) {
  const userID = req.user.id;
  const query = "SELECT * FROM vprp WHERE userID=$1";
  const value = [userID];
  executeGetQuery(query, value,res);
}

async function getActions(req, res) {
  const userID = req.user.id;
  const query = "SELECT * FROM ACTION WHERE userID=$1";
  const values = [userID];
  executeGetQuery(query, values,res);
}


module.exports = {
  getBasicInfoVprp,
  getBasic,
  getAll,
  getIssueId,
  getIssues,
  getAllVprp,
  getActions
};
