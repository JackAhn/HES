var express = require('express');
var app = express();
//기본 설정
var ip = '172.16.3.27';
var port = 8080;

var db = require('./modules/db.js');

//정적 파일 사용
app.use(express.static('public'));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);

//서버 연결
app.listen(port, ip, function(){
    console.log('server is started');
});


//mongodb 연결
db();
// var mongoose = require('mongoose');
// var config = require('./modules/config');
// mongoose.connect(config.dbURL(),  { useNewUrlParser: true } );

//db연결 확인
// var db = mongoose.connection;
//  db.on('error', console.error.bind(console, 'connection error:'));
//  db.once('open', function(){
//      console.log("mongodb is connected");
//  });

//post 방식으로 데이터 가져오기
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());

//세션 사용
var session = require('express-session');
var filestore = require('session-file-store')(session);
app.use(session({
    secret: 'keyboard',
    resave: false,
    saveUninitialized: true,
    store: new filestore()
}));

//게시판

//라우팅
var login = require('./routes/index')(app);


