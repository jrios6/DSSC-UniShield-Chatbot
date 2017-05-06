/* Dialog for profiling user's preferences using five questions
 * User's input is saved under session.userData
 */

var builder = require("botbuilder");

let questions = [
    function (session) {
      session.send("Hi there! I’m Andrew, your health insurance expert! To know you better, I will be asking you five simple questions.");
      builder.Prompts.text(session, "Q1. What’s your name?");
    },
    function (session, results) {
      session.userData.choice1 = results.response.entity;
      builder.Prompts.choice(session, "Q2. What's your gender?",
        ["Male", "Female"]);
    },
    function (session, results) {
      session.userData.choice2 = results.response.entity;
      builder.Prompts.text(session, "Q3. What's your date of birth?");
    },
    function (session, results) {
      session.userData.choice3 = results.response.entity;
      builder.Prompts.text(session, "Q4. What's your occupation?");
    },
    function (session, results) {
      session.userData.choice4 = results.response.entity;
      builder.Prompts.text(session, "Q5. Do you smoke? If so, how often?");
    },
    function (session, results) {
      session.userData.choice5 = results.response;
      session.send("Thanks for completing the profiling :)");
      var msg = new builder.SigninCard(session)
        .text(' Tap on the link to continue!')
        .button('Check out Profile', 'profile.html')
      var reply = new builder.Message(session)
                                  .attachments([msg]);
      session.endDialog(reply);
    },
]

module.exports.questions = questions;
