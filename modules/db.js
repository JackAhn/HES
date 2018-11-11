var mongoose = require('mongoose');
var config = require('./config');

module.exports = function(){
    function connect(){
        mongoose.connect(config.dbURL(), function(err){
            if(err){
                console.error('mongodb connection error', err);
            }
            else{
                console.log('mongodb connected');
            }
        });
    }
    connect();
    mongoose.connection.on('disconnected', connect);
    require('../routes/index.js');
};