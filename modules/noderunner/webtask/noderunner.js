var mysql = require('mysql');

/**
* executes code using Function constructor (form of eval)
* it's little bit safer when combined with "use strict"
* so it does not have an access to the global scope
*
* @param code string code to be executed
* @return whatever is returned by the code
*/
var executeCode = function(code) {
	var run = new Function('"use strict"; \n' + code);
	return run();
};

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

	   // get code from DB based on id from query string
	   con.query('SELECT * FROM nodecode WHERE id = ' + parseInt(ctx.data.codeid, 10), function (err, result) {
	    if (err) {
	    	cb(err);
	    }
	    if (!result || !result[0]) {
	    	cb(new Error('wrong code id'));
	    }

	    // execute given code
	    cb(null, executeCode(result[0].code));
	  });
	  
	});
};