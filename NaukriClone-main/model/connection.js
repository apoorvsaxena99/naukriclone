const mysql = require('mysql'); // import the package

//Database Connection
const db = mysql.createConnection({
    host     : '208.109.18.154',
    user     : 'cloneadmin',
    password : 'india@123',
    database:'naukriclone'
  });

db.connect((err)=>{
    if(err) throw err;
    console.log("Mysql connected");
});

module.exports = db;