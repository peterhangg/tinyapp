///// HELPER FUNCTIONS /////
const bcrypt = require('bcrypt');

// Generate a random 6 char string
const generateRandomString = () => {
  let charString = "abcdefghijklmnopqrstuvwxyz0123456789";
  let shortURL = "";
  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * charString.length);
    shortURL += charString[random];
  }
  return shortURL;
};

// validate the user's email matches the email in the User's database
const emailCheck = (emailAddress, database) => {
  for (let user in database) {
    if (database[user].email === emailAddress) {
      return true;
    }
  }
  return false;
};

// validiate the user's password matches their password in the User's database
const passwordCheck = (password, database) => {
  for (let user in database) {
    if (bcrypt.compareSync(password, database[user].password)) {
      return true;
    }
  }
  return false;
};

// Validates the user's email matches the one in the database and return it's user's ID
const idLookup = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user].id;
    }
  }
  return false;
};

// Filter out the URLs in the urlDatabase that matches the USER's ID
const urlsForUser = (id, database) => {
  let filteredURL = {};
  for (let urls in database) {
    if (database[urls]["userID"] === id) {
      filteredURL[urls] = database[urls];
    }
  }
  return filteredURL;
};

module.exports = {
  generateRandomString,
  emailCheck,
  passwordCheck,
  idLookup,
  urlsForUser
};