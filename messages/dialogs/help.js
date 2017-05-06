//Dialog for explaining what Unishield can do

let features = [
  function (session) {
      session.send("Just follow through with my simple questions and your health profile will be up in a jiffy!");
      session.endDialog();
  },
]

module.exports.features = features;
