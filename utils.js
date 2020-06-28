const {v4: uuid} = require('uuid');

exports.parseJSON = function (json_str) {
    try {
        return JSON.parse(json_str);
    } catch (ex) {
        return null;
    }
}

exports.stringJSON = function (json_obj) {
    try {
        return JSON.stringify(json_obj);
    } catch (ex) {
        return null;
    }
}

exports.replaceAll = function (str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

exports.getId = function () {
    return uuid().replace(new RegExp("-", 'g'), "");
}