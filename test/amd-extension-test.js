var buster = require("buster");
var amd = require("../lib/buster-amd");
var c = require("../../buster-configuration");
var group = undefined;
var handlers = undefined;
buster.testCase("AMD extension", {
    "configuration": {
	setUp: function() {
	    group = c.create().addGroup("test", {
		options: {},
	    }, "rootpath");

	},
	
	"empty group" : (function() { 
	    var rs, err, data;
	    var ctx = this;
	    return {
		setUp: function(done) {
		    amd.configure(group);
		    group.on("load:resources", function(resourceSet) {
			rs = resourceSet;
			done();
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
		    });
		},
		"disables autoRun": function() {
		    assert(group.options.autoRun === false);
		},
		"adds loader module": function() {
		   refute.defined(err);		    
		},
		"loader module starts test-run":  function() {
		    assert.match(data.content, "buster.run();");
		},
		"loader module requires dependenceis": function() {
		    assert.match(data.content, /^require\(\[\]/);
		},
		"loader module is appended to load": function(done) {
		    rs.getReadOnly(function(err, res) {
			assert.match(res.load, function(act) {
			    return act.indexOf("/_buster-load-all.js") !== -1;
			});
			done();
		    });
		}
		
	    };
	})()
    }
});
