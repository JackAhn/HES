module.exports = function(app){

    app.get('/', function(req, res){
        res.render('login');
    });

    var members = require('../models/member');

    app.post('/login', function(req, res){
        var id = req.body.username;
        var pw = req.body.password;
        members.find({'id': id, 'pw': pw}, function(err, member){
            if(err)
                return res.status(500).send({error: 'database failure'});
            if(member==false){
                res.render('check', {pass: false});
            }
            else{
                console.log(member);
                req.session.save(function(){
                    res.render('check', {pass: true, data: member});
                });
            }
        });
    });

    var noticeboard = require('../models/noticeboard');
    var nickname;


    app.get('/main', function(req,res){
        nickname = req.param('nickname');
        if(nickname!=null)
            req.session.nickname = nickname;
        var page = req.param('page');
        if(page==null)
            page=1;
        var skipsize = (page-1)*10;
        var limitSize = 10;
        var pageNum = 1;
        
        noticeboard.count({deleted:false}, function(err, totalcount){
            if(err)
                console.log(err);
            pageNum = Math.ceil(totalcount/limitSize);
            noticeboard.find({deleted:false}).sort({date:-1}).skip(skipsize).limit(limitSize).exec(function(err, content){
                if(err)
                    throw err;
                
                noticeboard.count({deleted:false}, function(err,totalcount){
                    if(err)
                        console.log(err);
                    noticeboard.find({deleted:false}).sort({good:-1}).exec(function(err, content2){
                        if(err)
                            throw err;
                            res.render('main', { title: 'Board', contents: content, contents2: content2, pagination: pageNum, nickname: req.session.nickname });
                        });
                    });
            });
        });
    });

    
    app.get('/board', function(req,res){
        var page = req.param('page');
        if(page==null)
        page=1;
        var skipsize = (page-1)*10;
        var limitSize = 10;
        var pageNum = 1;
        
        noticeboard.count({deleted:false}, function(err, totalcount){
            if(err)
            console.log(err);
            pageNum = Math.ceil(totalcount/limitSize);
            noticeboard.find({deleted:false}).sort({date:-1}).skip(skipsize).limit(limitSize).exec(function(err, content){
                if(err)
                    throw err;
                    console.log(nickname);
                    res.render('board', { title: 'Board', contents: content, pagination: pageNum, nickname: req.session.nickname });
                });
            });
    });


    app.get('/write', function(req,res){
        res.render('write', {nickname: req.session.nickname});
    });

    app.post('/submit', function(req, res){
        var addNewTitle = req.body.addContentSubject;
        var addNewWriter = req.body.addContentWriter;
        var addNewContent = req.body.addContents;
        console.log(addNewTitle);
        addBoard(addNewTitle, addNewWriter, addNewContent);
        res.redirect('/main');
    });
    function addBoard(title, writer, content){
        var newnoticeboard = new noticeboard();
        
        newnoticeboard.nickname = writer;
        newnoticeboard.title = title;
        newnoticeboard.contents = content;
        newnoticeboard.save(function (err) {
            if (err)
                console.log(err);
        });
    }
    var contentid;
    app.get('/view', function(req,res){
        contentid = req.param('id');
        noticeboard.findOne({_id:contentid}, function(err, content){
            if(err)
                console.log(err);
            content.count+=1;
            content.save(function(err){
                if(err)
                    console.log(err);
                res.render('show', {title:"Board", content:content, ismine : req.session.nickname});
            });
        });
    });
    app.get('/modify', function(req, res){
        noticeboard.find({nickname: req.session.nickname}).exec(function(err, content){
            if(err)
                throw err;
            console.log(content);
            userid = content[0]._id;
            res.render('modify', {title: 'Board', contents: content, nickname: req.session.nickname});
        });
    });
    app.post('/readymodify', function(req,res){
        var addmodTitle = req.body.addContentSubject;
        var addmodWriter = req.body.addContentWriter;
        var addmodContent = req.body.addContents;

        // noticeboard.findOne({nickname: addmodWriter}, function(err, origincontent){
        //     console.log(origincontent);
        //     origincontent.updated.push({title: origincontent[0].title, contents: origincontent[0].contents});
        //     origincontent.save(function(err){
        //         if(err)
        //             console.log(err);
        //     });
        // });
        noticeboard.update({nickname: addmodWriter}, {$set:{title:addmodTitle, contents: addmodContent, date: Date.now()}}, function(err){
            if(err)
                console.log(err);
        });
        res.redirect('/main');
    });
    app.get('/delete', function(req,res){
        res.render('delcheck');
    });
    app.get('/godelete', function(req, res){
        noticeboard.update({_id: contentid},{$set:{deleted:true}}, function(err){
            if(err)
                console.log(err);
            res.redirect('/main');
        });
    });




    //회원가입
    app.get('/goregister', function(req, res){
        res.render('Join');
    });
    app.post('/insert', function(req, res){
        var id = req.body.id;
        var pw = req.body.pw;
        var name = req.body.name;
        var nickname = req.body.nickname;

        var newmember = new members();
        newmember.name = name;
        newmember.id = id;
        newmember.pw = pw;
        newmember.nickname = nickname;

        newmember.save(function(err){
            if(err)
                console.log(err);
            res.redirect('/');
        });
    });
};


