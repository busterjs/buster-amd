var config = module.exports;
config["web-module"] = {
    environment: "browser",
    rootPath: "js",
    tests: ["test/*test.js"],
    resources: ["require-jquery.js"],
    libs: ["require-jquery.js"],
    extensions: [require("buster-amd")]
}







