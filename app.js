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

var nodemailer = require('nodemailer');
var atob = require('atob');
var Jimp = require('jimp');


var transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: '587',
  secureConnection: false,
  requireTLS: true,
  tls: {
    ciphers:'SSLv3',
    rejectUnauthorized: false 
  },
  auth: {
    user: 'no-reply@datemates.fun',
    pass: 'loomCayman345',
  }
});
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});


app.get('/',function(req,res){
  res.render('home');
});

app.get('/invite/:email/:name',function(req,res){
  var context = {};
  context.title = " - Invite";
  context.url = `/invite/${req.params.email}/${req.params.name}`;
  context.email = atob(req.params.email);
  context.name = atob(req.params.name);
  res.render('invite', context);
});

app.post('/invite/:email/:name', async (req,res) => {
  try {
    var email = atob(req.params.email);
    var name = atob(req.params.name);
    var data = req.body;
    const inviteImage = await makeImg(name, data);
    //res.send(inviteImage);
    
    var message = "Invite Form Results\n";
    for (var key in data){
      if (data[key] == null){
        next;
      }
      message += `${key}: ${data[key]}\n`;
    }
    var mailOptions = {
      from: 'no-reply@datemates.fun',
      to: email,
      subject: `Date Mates: Enjoy your date ${name}!`,
      text: message,
      attachments: [{
        filename: inviteImage,
        path: __dirname+`/${inviteImage}`
      }],
      dsn: {
        id: 'some random message specific id',
        return: 'headers',
        notify: ['failure', 'delay'],
        recipient: 'no-reply@datemates.fun'
      }
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.render('invitedone');
  } catch (error) {
    return next(error);
  }
});



app.get('/survey/:email/:name',function(req,res){
  var context = {};
  context.title = " - Survey";
  context.url = `/survey/${req.params.email}/${req.params.name}`;
  context.email = atob(req.params.email);
  context.name = atob(req.params.name);
  res.render('survey', context);
});

app.post('/survey/:email/:name',function(req,res){
  var email = atob(req.params.email);
  var name = atob(req.params.name);
  var data = req.body;
  var message = "Survey Form Results\n";
  for (var key in data){
    if (data[key] == null){
      next;
    }
    message += `${key}: ${data[key]}\n`;
  }
  var mailOptions = {
    from: 'no-reply@datemates.fun',
    to: email,
    subject: `Date Mates: After date survey results!`,
    text: message,
    dsn: {
      id: 'some random message specific id',
      return: 'headers',
      notify: ['failure', 'delay'],
      recipient: 'no-reply@datemates.fun'
  }
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.send(message);
});


app.post('/surveyaction',function(req,res){
  res.send(req.body)
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

async function makeImg(name, data) {
  let name2 = data["Name"];
  let style = data["Style"];
  let fanciness = data["Fanciness"];
  let dressMsg = dress(fanciness);
  let dateTime = data["Date"];
  let regex = /([0-9]+)\-([0-9]+)\-([0-9]+)T([0-9]+\:[0-9]+)/;
  let match = dateTime.match(regex);
  let ordinal = getOrdinal(match[3][1]);
  let month = getMonth(match[2]);
  let date = `${match[3]}${ordinal} ${month} ${match[1]}`;
  let time = `Time: ${match[4]}`;
  
  let image = await Jimp.read('./imgs/casualTemplate.jpg');
  let width = image.bitmap.width;
    
  Jimp.loadFont(Jimp.FONT_SANS_64_WHITE) // Small Font
    .then(font => {
      // Print Greeting
      image.print(font, (width-650)/2, 162, {
        text: `${name} invites ${name2} To:`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP
      }, 650, 162);
      
      // Print Dress fanciness
      image.print(font, (width-810)/2, 970, {
        text: dressMsg,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP
      }, 810, 66);

      // Print date of the date
      image.print(font, (width-810)/2, 1080, {
        text: `${date}`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP
      }, 810, 66);

      // Print time of the date
      image.print(font, (width-810)/2, 1187, {
        text: `${time}`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP
      }, 810, 66);

      return image;
    });

  Jimp.loadFont(Jimp.FONT_SANS_128_WHITE) // Large Font
    .then(font => {
      // Print Date Activity
      image.print(font, (width-810)/2, 340, {
        text: `${style}`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP
      }, 810, 505);
      return image;
    }).then(image => {
      return image.writeAsync('./casualInvite.png');
  });

  return "casualInvite.png";
}

function dress (fanciness) {
  switch (fanciness) {
    case "1":
      return "A PYJAMAS DRESS DATE";
    case "2":
      return "A SPORTY DRESS DATE";
    case "3":
      return "A CASUAL DRESS DATE";
    case "4":
      return "A BUSINESS DRESS DATE";
    case "5":
      return "A FANCY DRESS DATE";
    default:
      return "An Error Ocurred.."
  }
}

function getOrdinal (day) {
  switch (day) {
    case "1":
      return "st";
    case "2":
      return "nd";
    case "3":
      return "rd";
    default:
      return "th";
  }
}

function getMonth (month) {
  switch (month) {
    case "01":
      return "Jan.";
    case "02":
      return "Feb.";
    case "03":
      return "Mar.";
    case "04":
      return "Apr.";
    case "05":
      return "May";
    case "06":
      return "Jun.";
    case "07":
      return "Jul.";
    case "08":
      return "Aug.";
    case "09":
      return "Sept.";
    case "10":
      return "Oct.";
    case "11":
      return "Nov.";
    case "12":
      return "Dec.";
    default:
      return "Error";
  }
}
