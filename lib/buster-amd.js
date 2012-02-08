var Path = require('path');

function quote(t) {
    return "'" + t + "'";
}

module.exports =  {
    create: function (options) {
        var ext = Object.create(this);
        ext.setDependencyDecorator(options && options.dependencyDecorator);

        return ext;
    },

    setDependencyDecorator: function (decorator) {
        this.dependencyDecorator = decorator || function (dep) {
            return dep.replace(/\.js$/, "").replace(/^\//, "");
        };
    },

    configure: function (conf) {
	var tests;
	var decorator = this.dependencyDecorator;
	conf.options.autoRun = false;

        conf.on("load:tests", function (resourceSet) {
            tests = resourceSet.loadPath.paths();
            resourceSet.loadPath.clear();
        });

	conf.on("load:resources", function (rs) {
            var testFiles = tests.map(decorator).map(quote).join(", ");
            var identifiers = tests.map(function (t, i) { return "t" + i; });
	    
	    rs.addResource({
                path: "/buster/load-all.js",
		content: "require([" + testFiles + "], function(" +
                    identifiers.join(", ") + ") {\n" +
		    "  console.log('loading');\n" +
		    "  buster.run();\n});"
	    });

	    rs.loadPath.append("/buster/load-all.js");
        });
    }
};
