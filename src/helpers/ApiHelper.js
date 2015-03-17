var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var ApiHelper = function(){};

_.assign(ApiHelper.prototype, {
    buildCacheKey: function(list){
        var cacheKey = "_";
        _.forOwn(list, function(item, key){
            cacheKey = cacheKey + key + ":" + item + "_";
        });

        return cacheKey;
    }
});

module.exports = new ApiHelper();