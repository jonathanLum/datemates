var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
const port = process.env.PORT || 3000
app.use(express.static(__dirname + '/'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', port);

var atob = require('atob');


app.get('/',function(req,res){
  res.render('home');
});

app.get('/invite/:email/:name',function(req,res){
  var context = {};
  context.email = atob(req.params.email);
  context.name = atob(req.params.name);
  res.render('invite', context);
});

app.get('/survey/:email/:name',function(req,res){
  var context = {};
  context.email = atob(req.params.email);
  context.name = atob(req.params.name);
  res.render('survey', context);
});

app.post('/inviteaction',function(req,res){
  res.send(req.body)
});

app.post('/surveyaction',function(req,res){

});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});