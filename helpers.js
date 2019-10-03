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
}

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

module.exports = {
  generateRandomString,
  emailCheck,
  passwordCheck

}