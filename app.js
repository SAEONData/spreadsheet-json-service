require('dotenv').config();
const express = require('express');
const app = express();

const GoogleSheetReader = require('./google_sheets_reader');
const GoogleAuthEngine = require('./google_auth_engine');

app.get('/', function (request, response) {
  let reader = new GoogleSheetReader();
  //let result = reader.requestSheet();

  let engine = new GoogleAuthEngine();
  engine.authenticateAndRun(null);

  let reply = {hello: "world"};
  return response.json(reply);
});


app.listen(3000, () => console.log('Example app listening on port 3000!'));
