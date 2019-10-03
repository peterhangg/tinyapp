///// HELPER FUNCTIONS /////

const generateRandomString = () => {
  let charString = "abcdefghijklmnopqrstuvwxyz0123456789";
  let shortURL = "";
  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * charString.length);
    shortURL += charString[random];
  }
  return shortURL;
}

const emailCheck = (emailAddress, database) => {
  for (let user in database) {
    if (database[user].email === emailAddress) {
      return true;
    }
  }
  return false;
};

module.exports = {
  generateRandomString,
  emailCheck
}