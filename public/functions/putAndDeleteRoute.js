const pool = require("../models/db")

async function updateData(req,res){
    try {
        const className = req.body.className;
        const dataID = req.body.id;
        const files = req.files;
        let query;
        let values;
        let images = [];
        if (className === "issue") {
          query =
            "UPDATE ISSUE SET para_no = $1 , issue_no = $2 ,issuetype = $3,issuecategory = $4,issuesubcategory = $5,issuestatus = $6,amount = $7 WHERE id=$8";
          values = Object.values(req.body);
          values.shift();
          values.pop();
          values.pop();
          values.pop();
          values.pop();
          values.push(dataID);
        } else if (className === "action") {
          query =
            "UPDATE ACTION SET parano=$1,issueno=$2,proceedingnumber=$3,proceedingdate=$4,totalamount=$5,amountrecovered_sgs=$6,amountrecovered_hlc=$7,basedondocument=$8,tokenrecovery=$9,dateofhlc=$10 WHERE id=$11";
          values = Object.values(req.body);
          values.shift();
          values.splice(2, 1);
          values.pop();
          values.splice(9, 2);
          values.push(dataID);
        } else if (className === "vprp") {
          query =
            "UPDATE vprp SET name=$1, secondname=$2, gender=$3, community=$4, education=$5, jobcardno=$6, address=$7, email=$8, mobile=$9, bankname=$10, accountnumber=$11, ifsc=$12, pan=$13, status=$14, block=$15, district=$16 WHERE id=$17";
          values = Object.values(req.body);
          values.pop();
        } else if (className === "basic") {
          query =
            "UPDATE basic_information SET nickname=$1, state=$2, district=$3, block=$4, panchayat=$5, startDate=$6, endDate=$7, GSDate=$8, expenditureyear=$9, auditedyear=$10, roundnumber=$11, SAPFromDate=$12, SAPtoDate=$13, WRGbyIA=$14, MRGbyIA=$15, TRGbyIA=$16 , " +
            "numberOfWorks=$17 ,worksVerified=$18 ,houseHoldsWorked=$19 ,houseHoldsVerified=$20 ,noOfpeopleinGS=$21 ,honorariumExpenses=$22 ,travelExpenses=$23 ,p_p_b_Expenses=$24,videoExpenses=$25,otherExpenses=$26,totalExpenses=$27,vrpIDs=$28,images=$29 " +
            "WHERE id=$30";
          values = Object.values(req.body);
          images = values.pop().split(",");
          values.pop();
          values.pop();
          files.forEach((data) => {
            images.push(data.path);
          });
          ids = values.pop();
          if (ids == null || ids === "") {
            ids = [];
          } else {
            ids = ids.split(",");
          }
          values.push(ids);
          values.push(images);
          values.push(dataID);
        }
    
        if(query){
          const result = await pool.query(query,values);
        }
    
        res.json({ code: "200" });
      } catch (e) {
        console.log(e);
      }
}

async function deleteData(req,res){
    try {
        const className = req.body.className;
        const id = req.body.id;
        let query;
        let values = [id];
        if (className === "issue") {
          query = "DELETE FROM issue WHERE id=$1";
        } else if (className === "action") {
          query = "DELETE FROM action WHERE id=$1";
        } else if (className === "vprp") {
          query = "DELETE FROM vprp WHERE id=$1";
        } else if (className === "basic") {
          query = "DELETE FROM action WHERE basicID=$1";
          await pool.query(query, values);
          query = "DELETE FROM issue WHERE basicID=$1";
          await pool.query(query, values);
          query = "DELETE FROM basic_information WHERE id=$1";
        }
        const result = await pool.query(query, values);
        res.json({ code: "200" });
      } catch (e) {
        console.log(e);
      }
}

module.exports = {updateData,deleteData}; 