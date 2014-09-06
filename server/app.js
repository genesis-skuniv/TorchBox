var fs = require('fs');
var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var mysql = require('mysql');

// 서버를 생성합니다.
var app = express();

//Mysql 접속
var connection = mysql.createConnection({
    user : 'root',
    password : '456123',
    database:'Test'
});

// 미들웨어를 설정합니다.
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(app.router);

// 서버를 실행합니다.
var server = http.createServer(app).listen(80, function () {
    console.log('Server running at 80');
});

// 라우터를 설정합니다.
app.get('/', function (request, response) {
    
    if(request.cookies.auth){//인증된 쿠키가 있다면 채팅
        //socket.io 부분
        fs.readFile('index.html',function (error, data){
            response.writeHead(200, {'Content-Type' : 'text/html'});
            response.end(data);
        });

        var io = socketio.listen(server);

        io.sockets.on('connection', function (socket){
            socket.on('message', function (data){
                var author = request.cookies.author;
                var contents = data.message;
                var date = data.date;

                io.sockets.emit('message', data);
                console.log(data);
                
                connection.query('INSERT INTO message (author, contents, date) VALUES (?,?,?)', [ author, contents, date ]);

            });
        });

    }else{
        //로그인이 되지 않았다면 로그인 페이지로 
        response.redirect('/login');
    }
});

//로그인 
app.get('/login', function (request, response) {
    fs.readFile('login.html',function (error,data){
        response.send(data.toString());
    });
});

app.post('/login', function (request, response) {
    //폼에서 값을 받아 옴  
    var id = request.param('id');
    var password = request.param('password');

    console.log(id, password);
    console.log(request.body);
    
    //DB에 질의를 보냄 
    var query = connection.query('SELECT * FROM account', function (err,rows){

        if(err)throw err;//예외처리 
        
        //가져온 결과에서 계정을 찾음 
        for(var i=0; i<rows.length; i++){
            if(id == rows[i].id && password == rows[i].password){//일치 한다면 
                //쿠키생성
                response.cookie('auth',true);
                response.cookie("author", id);
                response.redirect('/');//메인페이지로
                break;    
            }else{//전부 불일치 라면 
                if(i == rows.length-1){
                    response.redirect('/login');
                }
            }
        }
    });
    
});
app.get('/logout',function (request, response){
    response.clearCookie('auth');
    response.clearCookie('author');
    response.redirect('/login');
});
//계정 등록
app.get('/signup',function (request, response){
    fs.readFile('signup.html',function (error, data){
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.end(data);
    });
});

app.post('/signup', function (request, response) {
    //폼에서 값을 받아옴 
    var body = request.body;

    console.log(request.body);
    
    //DB에 질의를 보냄 
    connection.query('INSERT INTO account (id, password) VALUES (?,?)', [  body.id, body.password ] , function (){
  
        response.redirect('/login') ;
    });
    
});

app.get('/load',function (request, response){
    connection.query('SELECT * FROM message', function (error, rows){
        console.log(rows);
        response.json(rows);
    });
});

app.get('/loadauthor',function (request, response){
    console.log(request.cookies.author);
    response.send(request.cookies.author);
});
