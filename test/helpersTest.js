const { assert } = require('chai');
const bcrypt = require('bcrypt');

const { emailCheck } = require('../helpers.js');
const { passwordCheck } = require('../helpers.js');
const { idLookup } = require('../helpers.js');
const { urlsForUser } = require('../helpers.js');

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur",10)
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "a@a.com",
    password: bcrypt.hashSync("123", 10)
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

describe('emailCheck', function() {
  it('should return true if the email the user passed in when logging in is a valid email', function() {
    const user = emailCheck("user@example.com", users);
    const expectedOutput = true;
    assert.equal(user, expectedOutput);
  });

  it('should return false when a user trys to login with no email', function() {
    const user = emailCheck("", users);
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });

  it('should return a user with valid password', function() {
    const user = passwordCheck("123", users);
    const expectedOutput = true;
    assert.equal(user, expectedOutput);
  });

  it("should return the user's ID if the email they entered when logging in matches the one in the database", function() {
    const user = idLookup("a@a.com", users);
    const expectedOutput = "aJ48lW";
    assert.equal(user, expectedOutput);
  });

});