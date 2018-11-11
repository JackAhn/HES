//회원 스키마
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memberSchema = new Schema({
    name : String,
    id : String,
    pw : String,
    nickname : String
});

module.exports = mongoose.model('member', memberSchema, 'member');