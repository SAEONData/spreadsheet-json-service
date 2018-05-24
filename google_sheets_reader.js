const {google} = require('googleapis');
const Client = require('node-rest-client').Client;
const Q = require('q');

function GoogleSheetsReader() {
  this.requestSheet = function() {
    let client = new Client();
    let url = `${process.env.GOOGLE_API_URL}/${process.env.SHEET_ID}/values/${process.env.RANGE}?key=${process.env.GOOGLE_API_KEY}`
    console.log(url);
    let results = null;
    client.get(url, function(data, response){
      results = data;
      console.log(data);
    });
    return results;
  }
}

module.exports = GoogleSheetsReader;
