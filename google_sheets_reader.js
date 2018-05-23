const {google} = require('googleapis');
const AuthEngine = require('./google_auth_engine');
const SHEET_ID = '1h1YVNLPOVIAjCt082T-GIkKppq_iDTyudOrYSmLTCiM';

function GoogleSheetsReader() {
  this.listMajors = function() {
    let authEngine = new AuthEngine();
    let auth = authEngine.getAuth();
  }
}

module.exports = GoogleSheetsReader;