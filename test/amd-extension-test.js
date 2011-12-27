var buster = require("buster");
var amd = require("../lib/buster-amd");
var c = require("../../buster-configuration");

function withGroup(body, tests) {
    var group, rs, err, data, loadedtests;
    var instance = tests(
	function() {return group},
	function() {return rs},
	function() {return err},
	function() {return data},
	function() {return loadedtests}
        );

    instance.setUp = function(done) {
	group = c.create().addGroup("test", body, __dirname + "/fixtures");
	amd.configure(group);
	group.on("load:resources", function(resourceSet) {
	    rs = resourceSet;
	    done();
	});
	group.on("load:tests", function(t, rootPath) {
	    loadedtests = t;
	});

	group.resolve().then(function(){
	    group.setupFrameworkResources();
	}).then(function(){

	    rs.getResource("/_buster-load-all.js",
			   function(e, d) {
			       err = e;
			       data = d;
			       done();
			   });
	},
	function(err){
	    refute.defined(err);
	});
    }
    return instance;

};


buster.testCase("AMD extension", {
    "configuration": {
	"empty group" : withGroup({}, function(group, rs, err, data) {
	    return {
		"disables autoRun": function() {
		    assert(group().options.autoRun === false);
		},
		"adds loader module": function() {
		    refute.defined(err());		    
		},
		"loader module starts test-run":  function() {
		    assert.match(data().content, "buster.run();");
		},
		"loader module requires dependenceis": function() {
		    assert.match(data().content, /^require\(\[\]/);
		},
		"loader module is appended to load": function(done) {
		    rs().getReadOnly(function(err, res) {
			assert.match(res.load, function(act) {
			    return act.indexOf("/_buster-load-all.js") !== -1;
			});
			done();
		    });
		}
	    };
	}),
	"group with tests": withGroup({
	    tests: ["foo-test.js", "bar-test.js"],
	    rootPath: "."
	}, function(group, rs, err, data, tests) {
	    return {
		"removes tests from group" : function() {
		     assert.equals(tests(), []);
		},
		"depends on tests from loader module" : function() {
		    assert.match(data().content, /'foo-test', 'bar-test'/);
		}
	    };
	})
    }
});
