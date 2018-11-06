var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host  : 'classmysql.engr.oregonstate.edu',
  user  : 'cs340_hoelschb',
  password: '8665',
  database: 'cs340_hoelschb',
  dateStrings: true
});

module.exports.pool = pool;