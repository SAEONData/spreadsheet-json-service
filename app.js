const express = require('express');
const app = express();

const GoogleSheetReader = require('./google_sheets_reader');

app.get('/', function (request, response) {
  let reader = new GoogleSheetReader();
  let r = reader.listMajors();
  console.log(r);

  let reply = {hello: 'World'};
  return response.json(reply)
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
