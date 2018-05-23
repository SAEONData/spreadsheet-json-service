const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const _ = require('lodash');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'credentials.json';
const SHEET_ID = '1-SNFF58_6wNs2gyP_9FiTuCnl-lryjyltD019S6NlMU';
const RANGE = 'Form Responses 1!A1:H'

function googleAuthEngine() {
  this.getAuth = function(){

    // Load client secrets from a local file.
    fs.readFile('client_secret.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      return authorize(JSON.parse(content), listMajors);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
      const {client_secret, client_id, redirect_uris} = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
      });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getNewToken(oAuth2Client, callback) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });
      console.log('Authorize this app by visiting this url:', authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return callback(err);
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) console.error(err);
            console.log('Token stored to', TOKEN_PATH);
          });
          callback(oAuth2Client);
        });
      });
    }


    /**
     * Prints the names and majors of students in a sample spreadsheet:
     * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     */
    function listMajors(auth) {
      const sheets = google.sheets({version: 'v4', auth});
      sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: RANGE,
      }, (err, {data}) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = data.values;
        if (rows.length) {
         let headers = rows[0];
         let resultString = "{";
         _.forEach(rows, function(row){
           let element = "{";
           for(var i = 0; i < headers.length; ++i){
             let val = `"${headers[i]}":"${row[i]}",`;
             element += val;
           }
           element += "}, ";
           resultString += `${element},`
         });
         resultString += "}"
         return resultString;
        } else {
          console.log('No data found.');
        }
      });
    }


    return {user: 'Auth OK!'};
  }

}

module.exports = googleAuthEngine;
