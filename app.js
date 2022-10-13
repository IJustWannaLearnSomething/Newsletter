const express = require( 'express' )
const bodyParser = require( 'body-parser' )
const app = express()
const https = require( 'node:https' )

app.use( bodyParser.urlencoded({ extended : true }) )

// to make sure we can access the directory in html file
app.use(express.static( "public" ))

// send index.html when request for root
app.get( '/' , ( req , res ) => {
  res.sendFile( __dirname + "/signup.html" )
})

// handle post request by form click
app.post('/' , ( req, res ) => {
  var fName = req.body.firstName
  var sName = req.body.secondName
  var email = req.body.email
  console.log(fName + " " + sName + " " + email)

  // make a js object to organize inputted data
  var data = {
    members : [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: sName
      }
    }]
  }

  // convert js object to JSON string
  const jsonData = JSON.stringify(data)


  var url = "https://us21.api.mailchimp.com/3.0//lists/55bb12aca4/";

  var options = {
    method: "POST",
    auth: "as00r:5769da0b77ad7334e91c674ba6770cc3-us21"
  }

  // https request for api call
  var request = https.request( url , options , (response) => {
    response.on( "data" , ( data ) => {
      if(response.statusCode === 200) {
        res.sendFile( __dirname + "/success.html" )
      } else {
        res.sendFile( __dirname + "/failure.html" )
      }
    })
  })

  request.write(jsonData)
  request.end()
})


// handle post request by try again btn
app.post( "/failure" , ( req , res ) => {
  res.redirect( "/" )
})

app.listen( process.env.PORT || 3000, ( req , res ) => {
  console.log("Server running on port 3000")
})


// API Key: 5769da0b77ad7334e91c674ba6770cc3-us21
// Audience ID: 55bb12aca4
