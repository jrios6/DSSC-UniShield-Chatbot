"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

//Dialog Modules
var help = require("./dialogs/help.js");
var profiling = require("./dialogs/profiling.js");
var deleteProfile = require("./dialogs/deleteProfile.js");

var useEmulator = true//(process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b2fb8232-992d-4838-8caf-b6d05bfe08cc?subscription-key=7540fc2268fa47f7a57ea60184c2d7fb&timezoneOffset=0.0&verbose=true&q=';
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

dialog.onDefault(function (session, args, next) {
  session.send("Sorry, I didn't understand!");
});

//Dialog Matching
dialog.matches('greetings', [
 (session) => {
      if (session.userData.choice1) {
        //User has already been profiled
        session.beginDialog('/features');
      } else {
        //Starts profiling user
        session.beginDialog('/profiling');
      }
    }
]);

dialog.matches('delete_profile', [
  (session) => {
    session.beginDialog('/deleteprofile');
  }
]);

//Dialogs
bot.dialog('/deleteprofile', deleteProfile.confirm); //deleting user's profile
bot.dialog('/profiling', profiling.questions);// profiling of user
bot.dialog('/features', help.features); //describes the features


if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}
