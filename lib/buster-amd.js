var Path = require('path');

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
	var rootPath;
	var decorator = readDecorator(conf);
	
	conf.options.autoRun = false;
	conf.on("load:tests", function(tests, root) {
	    rootPath = root;
	    while(tests.length > 0) {testsToLoad.unshift(tests.pop())}
	});
	conf.on("load:resources", function(rs) {
	    var testsStr = testsToLoad.map(decorator).map(function(t){return "'"+t+"'"}).join(", ");
	    var testIdentifiers = [];
	    for(num in testsToLoad) {
		testIdentifiers.push("t"+num);
	    }
	    
	    var res = rs.addResource("/_buster-load-all.js", {
		"content": "require(["+testsStr+"], function("+testIdentifiers.join(", ")+") {\n"+
		           "  console.log('loading');\n"+
		           "  buster.run();\n"+
	                   "});"
	    });
	    testsToLoad.forEach(function(t) {
		rs.addFile(Path.join(rootPath, t), {path: t});
	    });

	    rs.appendToLoad(res["path"]);
	});
    }
}