const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const _ = require('lodash');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'credentials.json';

const Q = require('q');

function GoogleAuthEngine() {
  this.authenticateAndRun = function(callBackFunction){
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
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     */
    function listMajors(auth) {
      const sheets = google.sheets({version: 'v4', auth});
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range: process.env.RANGE,
      }, (err, res) => {
        if (err) {
          console.log(res)
           console.log('The API returned an error: ' + err);
           return;
        }

        if (res.data) {
          const rows = data.values;
          if (rows.length) {
            let headers = rows[0];
            let resultMap = {};
            for (var j = 1; j < rows.length; ++j) {
              let row = rows[j];
              let element = j > 1 ? ',{': '{';
              for(var i = 0; i < headers.length; ++i){
                let val = `"${headers[i]}":"${row[i]}"`;
                val += i >= headers.length ? '': ','
                element += val;
              }
              element += '}';
              resultString += `${element}`;
            }
            console.log(result);
          }
        }
        else {
          console.log('No data found.');
        }
      });
    }
    return {user: 'Auth OK!'};
  }
}

module.exports = GoogleAuthEngine;
