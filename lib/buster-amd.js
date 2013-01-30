function quote(t) {
    return "'" + t + "'";
}

function amdWrapper(paths, mapper, baseUrl) {
    var tests = paths.map(mapper).map(quote),
        identifiers = paths.map(function (t, i) { return "t" + i; }),
        content = "";

    tests.unshift("'buster'");
    identifiers.unshift('buster');

    content = "define('buster', function(){ return buster; });" +
        "require([" + tests.join(", ") + "], function(" + identifiers.join(", ") +
        ") {\n  buster.run();\n});";

    // "normalize" to a baseUrl after buster requires the tests
    if (baseUrl) {
        content += "require.config({ baseUrl: 'assetic/r' });";
    }
    return content;
}

module.exports =  {
    name: "buster-amd",

    create: function (options) {
        var ext = Object.create(this);
        var mapper = options && options.pathMapper;
        ext.baseUrl = options && options.baseUrl;
        ext.pathMapper = mapper || function (path) {
            return path.replace(/\.js$/, "").replace(/^\//, "");
        };
        ext.preloadSources = !!options.preloadSources;
        ext.preloadTests = !!options.preloadTests;
        return ext;
    },

    configure: function (conf) {
        conf.options.autoRun = false;

        conf.on("load:tests", function (rs) {
            var paths = rs.loadPath.paths();
            rs.addResource({
                path: "/buster/load-all.js",
                content: amdWrapper(rs.loadPath.paths(), this.pathMapper, this.baseUrl)
            });
            if (!this.preloadTests) {
                rs.loadPath.clear();
            }
            rs.loadPath.append("/buster/load-all.js");
        }.bind(this));

        if (!this.preloadSources) {
            conf.on("load:sources", function (rs) { rs.loadPath.clear(); });
        }
    }
};
