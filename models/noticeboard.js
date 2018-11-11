var mongoose = require('mongoose');

var boardSchema = mongoose.Schema({
   nickname : String,
   title : String,
   contents : String,
   comments : [{
       name : String,
       memo : String
   }],
   count: {type:Number, default:0},
   good: {type:Number, default:0},
   date: {type:Date, default: Date.now()},
   deleted : {type:Boolean, default: false}
});

module.exports = mongoose.model('noticeboard', boardSchema, 'noticeboard');