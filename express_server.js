const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


function generateRandomString() {
  let charString = "abcdefghijklmnopqrstuvwxyz0123456789";
  let shortURL = "";
  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * charString.length);
    shortURL += charString[random];
  }
  return shortURL;
}

const emailCheck = (emailAddress) => {
  for (let user in users) {
    if (users[user].email === emailAddress) {
      return true;
    }
  }
  return false;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

/////////// GET REQUEST ////////////
app.get("/", (req, res) => {  // "/" is our root directory
  res.send("Hello!");
});

// get request to urlDatabase
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

// get request to urls
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,  user: users[req.cookies["user.id"]] };
  res.render("urls_index", templateVars);
});

// get request to creating new urls
app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase,  user: users[req.cookies["user.id"]] };
  res.render("urls_new", templateVars);
});

// get request to shortURLs
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["user.id"]] };
  // console.log("this is the shortURL req.params:", req.params.shortURL);
  res.render("urls_show", templateVars);
});

// get request longURL redirect
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// registration page 
app.get("/register", (req, res) => {
  let templateVars = { urls: urlDatabase,  user: users[req.cookies["user.id"]] };
  res.render("register", templateVars);
});

// login page
app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase,  user: users[req.cookies["user.id"]] };
  res.render("login", templateVars);
});

///////// POST REQUEST /////////
app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  if (!req.body.longURL.includes("http://")) { // append http to longURL
    req.body.longURL = `http://${req.body.longURL}`;
  }
  urlDatabase[newShortURL] = req.body.longURL; // adds a new shortURL to the urlDatabase when submitted in our form
  res.redirect(`/urls/${newShortURL}`); // redirects to /urls after submission
  console.log(urlDatabase);
});

// delete urls
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  console.log(urlDatabase);
  res.redirect("/urls");
});

// edit urls
app.post("/urls/:id", (req, res) => {
  const editURL = req.body.editURL;
  const id = req.params.id;
  urlDatabase[id] = editURL;
  // console.log(req.body);
  // console.log(urlDatabase);
  res.redirect(`/urls`);
});

// Login route
app.post("/login", (req, res) =>{
  console.log(req.body);
  res.cookie("username", req.body.username);
  console.log(req.body.username);
  res.redirect("/urls");
});

// Logout route
app.post("/logout", (req, res) =>{
  // console.log("user:", users[req.cookies["user.id"]])
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// handles registation form data
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id =  generateRandomString();

  if(!email || !password) {
    res.status(400).send("Please fill out the registation form as it is required.");
  } else if (emailCheck(email)) {
    res.status(400).send("This email already exist! Try again.");
  } else {
    users[id] = { id, email, password };
    console.log("User object:",users);
    res.cookie("user_id", id);
    res.redirect("/urls");
  }
});


///////// SERVER PORT /////////
app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});