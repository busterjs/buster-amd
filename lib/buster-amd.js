function readDecorator(conf) {
    var decorator  = conf.options.dependencyDecorator;
    if(!decorator || decorator == null) {
	decorator = function(dep) { return dep.replace(/\.js$/, '')};
    }
    return decorator;
}

module.exports =  {
    configure: function(conf) {
	var testsToLoad = [];
	var decorator = readDecorator(conf);
	conf.options.autoRun = false;
	conf.on("load:tests", function(tests, root) {
	    while(tests.length > 0) {testsToLoad.unshift(tests.pop())}
	});
	conf.on("load:resources", function(rs) {
	    var testsStr = testsToLoad.map(decorator).map(function(t){return "'"+t+"'"}).join(", ");
	    var res = rs.addResource("/_buster-load-all.js", {
		"content": "require(["+testsStr+"], function() {\n"+
		           "  console.log('loading');\n"+
		           "  buster.run();\n"+
	                   "});"
	    });
	    rs.appendToLoad(res["path"]);
	});
    }
}