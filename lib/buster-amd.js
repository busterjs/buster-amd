module.exports =  {
    configure: function(conf) {
	conf.options.autoRun = false;
	conf.on("load:tests", function(tests, root) {

	});
	conf.on("load:resources", function(rs) {
	    var res = rs.addResource("/_buster-load-all.js", {
		"content": "require([], function() {\n"+
		           "  console.log('loading');\n"+
		           "  buster.run();\n"+
	                   "});"
	    });
	    rs.appendToLoad(res["path"]);

	});
    }
}