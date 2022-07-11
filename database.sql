-- CREATE DATABASE PROJECTA;

--\l to show all database

--\dt to show the table

--move to ProjectA database =>  \c projecta

CREATE TABLE USERS (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL UNIQUE,
    subscription BOOLEAN NOT NULL,
    subscription_start DATE,
    subscription_end DATE
);


--Refresh Token

CREATE TABLE tokens(
    id SERIAL PRIMARY KEY NOT NULL,
    token VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE orderids(
    id SERIAL PRIMARY KEY NOT NULL,
    order_id VARCHAR(255) NOT NULL
);

CREATE TABLE BASIC_INFORMATION(
    id SERIAL PRIMARY KEY NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    block VARCHAR(255) NOT NULL,
    panchayat VARCHAR(255) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    GSDate DATE NOT NULL,
    expenditureyear DATE NOT NULL,
    auditedyear DATE NOT NULL,
    roundnumber INTEGER NOT NULL,
    SAPFromDate DATE NOT NULL,
    SAPtoDate DATE NOT NULL,
    WRGbyIA INTEGER NOT NULL,
    MRGbyIA INTEGER NOT NULL,
    TRGbyIA INTEGER NOT NULL,
    numberOfWorks INTEGER NOT NULL,
    worksVerified INTEGER NOT NULL,
    houseHoldsWorked INTEGER NOT NULL,
    houseHoldsVerified INTEGER NOT NULL,
    noOfpeopleinGS INTEGER NOT NULL,
    honorariumExpenses INTEGER NOT NULL,
    travelExpenses INTEGER NOT NULL,
    p_p_b_Expenses INTEGER NOT NULL,
    videoExpenses INTEGER NOT NULL,
    otherExpenses INTEGER NOT NULL,
    totalExpenses INTEGER NOT NULL,
    vrpIDs INTEGER[],
    userID SERIAL NOT NULL,
    images VARCHAR(255)[],
    FOREIGN KEY(userID) REFERENCES USERS(id)
);

CREATE TABLE VPRP(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    secondName VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    community VARCHAR(255) NOT NULL,
    education VARCHAR(255) NOT NULL,
    jobcardno VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(255) NOT NULL,    
    bankName VARCHAR(255) NOT NULL,
    accountNumber VARCHAR(255) NOT NULL,
    ifsc VARCHAR(255) NOT NULL,
    pan VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    block VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    userID SERIAL NOT NULL,
    FOREIGN KEY(userID) REFERENCES USERS(id)
);

CREATE TABLE ISSUE(
    id SERIAL PRIMARY KEY NOT NULL,
    para_no INTEGER NOT NULL,
    issue_no INTEGER,
    issueType VARCHAR(255) NOT NULL,
    issueCategory VARCHAR(255) NOT NULL,
    issueSubCategory VARCHAR(255) NOT NULL,
    issueStatus VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    userID SERIAL NOT NULL,
    basicID SERIAL NOT NULL,
    basicnickname VARCHAR(255) NOT NULL,
    FOREIGN KEY(userID) REFERENCES USERS(id),
    FOREIGN KEY(basicID) REFERENCES BASIC_INFORMATION(id)
);

CREATE TABLE ACTION(
    id SERIAL PRIMARY KEY NOT NULL,
    paraNo INTEGER NOT NULL,
    issueNo INTEGER NOT NULL,
    basicnickname VARCHAR(255) NOT NULL,
    dateofhlc DATE NOT NULL,
    proceedingNumber INTEGER NOT NULL,
    proceedingDate DATE NOT NULL,
    totalamount INTEGER NOT NULL,
    AmountRecovered_sgs INTEGER NOT NULL,
    AmountRecovered_hlc INTEGER NOT NULL,
    BasedOnDocument INTEGER NOT NULL,
    TokenRecovery INTEGER NOT NULL,
    userID SERIAL NOT NULL,
    basicID SERIAL NOT NULL,
    FOREIGN KEY(userID) REFERENCES USERS(id),
    FOREIGN KEY(basicID) REFERENCES BASIC_INFORMATION(id)
);

