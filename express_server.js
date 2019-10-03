const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

const { generateRandomString } = require('./helpers');
const { emailCheck } = require('./helpers');
const { passwordCheck } = require('./helpers');
const { idLookup } = require('./helpers');
const { urlsForUser } = require('./helpers');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ["key"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

///////// DATABASE /////////
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

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

/////////// GET REQUEST ////////////
app.get("/", (req, res) => {  //
  if (req.session.user_id) {
    res.redirect("/urls");
  }
  res.redirect("/login");
});

// get request to urlDatabase
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

// access "My URLs" page
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlsForUser(req.session.user_id, urlDatabase),
    user: users[req.session.user_id],
  };
  // console.log(templateVars);
  if (!req.session.user_id) {
    res.send("You must login first to access My URLs");
  }
  res.render("urls_index", templateVars);
});

// access page to create "new URLs"
app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase,  user: users[req.session.user_id] };
  if (!req.session.user_id) {
    res.redirect("/login");
    return;
  }
  res.render("urls_new", templateVars);
});

// access page that displays shortURLs with their corresponding longURLs
app.get("/urls/:shortURL", (req, res) => {
  if (!users[req.session.user_id]) {
    res.send("Must be logged in to access this page");
  } else if (!urlDatabase[req.params.shortURL]) {
    res.send("This TinyURL does not exist!");
  } else if (users[req.session.user_id].id !== urlDatabase[req.params.shortURL].userID) {
    res.send("This TinyURL does not belong to you!");
  } else {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.user_id], date: (new Date()).toLocaleString() };
    res.render("urls_show", templateVars);
  }
});

//load the webpage that is linked to it's shortURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// access registration page
app.get("/register", (req, res) => {
  let templateVars = { urls: urlDatabase,  user: users[req.session.user_id] };
  if (req.session.user_id) {
    res.redirect("/urls");
  }
  res.render("register", templateVars);
});

// access login page
app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase,  user: users[req.session.user_id] };
  res.render("login", templateVars);
});

///////// POST REQUEST /////////
// Add new URLs to the database
app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  if (!req.body.longURL.includes("http://")) { 
    req.body.longURL = `http://${req.body.longURL}`;
  }
  urlDatabase[newShortURL] = { longURL: req.body.longURL, userID: req.session.user_id, date: (new Date()).toLocaleString() }; 

  res.redirect(`/urls/${newShortURL}`); 
});

// delete URLs from the "My URLs" page
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.session.user_id) {
    res.send("Must login before deleting URL.");
    return;
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// edit longURLs that correspond with it's shortURL
app.post("/urls/:id", (req, res) => {
  let editURL = req.body.editURL;
  if (!editURL.includes("http://")) { 
    editURL = `http://${editURL}`;
  }
  if (!req.session.user_id) {
    res.send("Only logged-in users can edit URLs!");
  } else {
    urlDatabase[req.params.id].longURL = editURL;
  }
  res.redirect(`/urls`);
});

// login credentials
app.post("/login", (req, res) =>{
  const email = req.body.email;
  const password = req.body.password;
  if (!emailCheck(email, users)) {
    res.status(403).send("Email is not valid!");
  } else if (!passwordCheck(password, users)) {
    res.status(403).send("Invalid password");
  } else {
    req.session.user_id = idLookup(email, users);
  }
  res.redirect("/urls");
});

// logout user
app.post("/logout", (req, res) =>{
  req.session = null;
  res.redirect("/urls");
});

// handles registation form data
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id =  generateRandomString();

  if (!email || !password) {
    res.status(400).send("Please fill out the registation form as it is required.");
  } else if (emailCheck(email, users)) {
    res.status(400).send("This email already exist! Try again.");
  } else {
    users[id] = { id , email, password: bcrypt.hashSync(password, 10) };
    req.session.user_id = id;
    res.redirect("/urls");
  }
});

///////// SERVER PORT /////////
app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});

module.exports = {
  urlDatabase
};