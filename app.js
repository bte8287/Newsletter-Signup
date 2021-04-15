//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({
  extended: true
}));
//public folder which holds the css and images
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us7.api.mailchimp.com/3.0/lists/<LIST_ID>";
  const options = {
    method: "POST",
    auth: "<API_KEY>"
  };

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");

    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port: " + port);
});



// //API KEY
// //*****************
//
// //List Id
// //*****************

// OTHER POSSIBLE WAYS, UPDATED...

//The mailchimp API process changed since her video... must run:
//npm install @mailchimp/mailchimp_marketing
//const mailchimp = require("@mailchimp/mailchimp_marketing");

//setting up mailchimp config
// mailchimp.setConfig({
//   apiKey: "<************>",
//   server: "<***>",
// });

// const listID = "<list_ID>";
// const subscribingUser = {
//   firstName: firstName,
//   lastName: lastName,
//   email: email
// };

// async function run() {
//   const response = await mailchimp.lists.addListMember(listId, {
//     email_address: subscribingUser.email,
//     status: "subscribed",
//     merge_fields: {
//       FNAME: subscribingUser.firstName,
//       LNAME: subscribingUser.lastName
//     }
//   });

//    res.sendFile(__dirname + "/success.html")
//    console.log(
//      `Successfully added contact as an audience member. The contact's id is ${
// response.id
// }.`
//    );
//  }
//  run().catch(e => res.sendFile(__dirname + "/failure.html"));



// const run = async () => {
//   const response = await mailchimp.lists.batchListMembers("list_id", {
//     members: [data],
//   });
//   console.log(response); //It will show you the response from mailchimp
// };
// run();

// async function run() {
//   const response = await mailchimp.lists.batchListMembers("db9d7de2da", {
//     members:[subscribingUsers]
//   });
//   console.log(response);
// };
// run(listID);
