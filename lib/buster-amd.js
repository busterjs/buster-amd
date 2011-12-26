module.exports =  {
    configure: function(conf) {
	var testsToLoad = [];
	conf.options.autoRun = false;
	conf.on("load:tests", function(tests, root) {
	    while(tests.length > 0) {testsToLoad.unshift(tests.shift())}
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