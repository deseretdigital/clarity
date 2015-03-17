var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var ConfigHelper = function(){
    var self = this;
    var config = {};
    self.loadConfig();
};

_.assign(ConfigHelper.prototype, {
    loadConfig: function loadConfig(){
        this.config = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/../../config.json'), 'utf8'));
    }
});

module.exports = new ConfigHelper();