// jshint esversion: 6
var SMSResponses = require('./responses');
var twilio = require('twilio')(process.env.TWILIO_ID, process.env.TWILIO_TOKEN);


//===========send welcome message ====================//

exports.sendWelcome = function(userPhoneNumber) {

  twilio.sendMessage({
    to: `+1${userPhoneNumber}`, // Any number Twilio can deliver to
    from: '+14152003022', // A number you bought from Twilio and can use for outbound communication
    body: `Welcome to Hassle, loser.  You'll get a daily text from hassle to check in on your progress.  Stay on track... or you'll regret it. ` // body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio
    if (!err) { // "err" is an error received during the request, if any
      console.log(responseData.body); // outputs "word to your mother."
    }
  });
};


//=========== outbound period question service ====================//

exports.periodicGoalPoll = function(userPhoneNumber, userGoal) {
  twilio.sendMessage({
    to: `+1${userPhoneNumber}`, // Any number Twilio can deliver to
    from: '+14152003022', // A number you bought from Twilio and can use for outbound communication
    body: `Did you make progress towards your goal? ## ${userGoal} ## Respond 1 for 'yes' -or- 2 for 'no'.` //,
      //  mediaUrl: 'https://s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg'
      // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any
      console.log(responseData.body); // outputs "word to your mother."

    }
  });
};

//=========== outbound harassment message to USER ====================//

exports.harassUser = function(userPhoneNumber) {
  twilio.sendMessage({
    to: `+1${userPhoneNumber}`, // Any number Twilio can deliver to
    from: '+14152003022', // A number you bought from Twilio and can use for outbound communication
    body: `You're falling behind on your goal. Get back on track to stop sucking and end these messages.` //,
      //  mediaUrl: 'https://s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg'
      // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any
    }
  });
};


//=========== outbound harassment message to USER ====================//

exports.harassBuddy = function(buddyPhone) {
  twilio.sendMessage({
    to: `+1${buddyPhone}`, // Any number Twilio can deliver to
    from: '+14152003022', // A number you bought from Twilio and can use for outbound communication
    body: `You're getting annoyed bc your buddy is falling behind on their goal.` //,
      //  mediaUrl: 'https://s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg'
      // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any
    }
  });
};

//=========== outbound complete message to USER ====================//

exports.userGoalComplete = function(userPhoneNumber) {
  console.log('inside usergoal complete');
  twilio.sendMessage({
    to: `+1${userPhoneNumber}`, // Any number Twilio can deliver to
    from: '+14152003022', // A number you bought from Twilio and can use for outbound communication
    body: `Congerats on completing your goal. No seriously, we're proud...` //,
      //  mediaUrl: 'https://s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg'
      // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any
    }
  });
};

//=========== outbound complete message to USER ====================//

exports.buddyGoalComplete = function(buddyPhone) {
    console.log('inside buddy goal complete');
  twilio.sendMessage({
    to: `+1${buddyPhone}`, // Any number Twilio can deliver to
    from: '+14152003022', // A number you bought from Twilio and can use for outbound communication
    body: `Your buddy recently completed their goal. If they're lying, are they a friend worth keeping?` //,
      //  mediaUrl: 'https://s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg'
      // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any
    }
  });
};



//=========== respond to messages ====================//


exports.responseMaker = function(req, res) {

  var twilio = require('twilio');
  var twiml = new twilio.TwimlResponse();

  var randomPositive= Math.floor(Math.random() * SMSResponses.positiveResponses.length);

  var randomNegative= Math.floor(Math.random() * SMSResponses.negativeResponses.length);

  if (req.query.Body == 1) {
    twiml.message(SMSResponses.positiveResponses[randomPositive]);
  } else if (req.query.Body == 2) {
    twiml.message(SMSResponses.negativeResponses[randomNegative]);
    // twiml.mediahttps: //s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg
  } else {
    twiml.message(`dude, it's 1 or 2 for a response...`);
  }
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(twiml.toString());

};



//=========== get last inbound response not tied to user ====================//


exports.getLastResponse = function() {

  var lastResponse;

  var promise = new Promise(function(resolve, reject) {

    twilio.messages.list(function(err, data) {
      lastResponse = data.messages[1].body;
      //go to db
      resolve(data); //fance promise
    });
    return promise;
  })
  .then(function(data) {
    if (lastResponse === "1") {
      twilio.sendMessage({
        to: `+1${6468318760}`, // Any number Twilio can deliver to
        from: '+14152003022', // A number you bought from Twilio and can use for outbound communication
        body: `you must be very proud of yourself` // body of the SMS message
      }, function(err, responseData) { //this function is executed when a response is received from Twilio
        if (!err) { // "err" is an error received during the request, if any
        }
      });

    }

    if (lastResponse === "2") {
      twilio.sendMessage({
        to: `+1${6468318760}`, // Any number Twilio can deliver to
        from: '+14152003022', // A number you bought from Twilio and can use for outbound communication
        body: `wow you suck at this` // body of the SMS message
      }, function(err, responseData) { //this function is executed when a response is received from Twilio
        if (!err) { // "err" is an error received during the request, if any
          console.log(responseData.body); // outputs "word to your mother."
        }
      });
    }
  });

};


//=========== get all message history for testing ====================//
exports.getAllMessages = function() {
  twilio.messages.list(function(err, data) {
    data.messages.forEach(function(message) {
      console.log(message.body);
    });
  });
};


exports.spamCall = function(){

  twilio.makeCall({
    from: '+14152003022',
    to: '+16468318760',
    url: "http://demo.twilio.com/docs/voice.xml",
  }, function (err, responseData) {
    console.log(responseData);
  });
};
