var mysql = require('mysql');

var executeCode = function(code) {
	var run = new Function('"use strict"; \n' + code);
	return run();
}

module.exports = function (ctx, cb) {

	var con = mysql.createConnection({
	  host: ctx.secrets.host,
	  user: ctx.secrets.user,
	  password: ctx.secrets.pass,
  	  database: ctx.secrets.db
	});

	con.connect(function(err) {
	  if (err) {
	  	cb(err);
	  	return;
	  }

	   con.query('SELECT * FROM nodecode WHERE id = ' + parseInt(ctx.data.codeid, 10), function (err, result) {
	    if (err) {
	    	cb(err);
	    }
	    if (!result || !result[0]) {
	    	cb(new Error('wrong code id'));
	    }

	    cb(null, executeCode(result[0].code));
	  });
	  
	});
}