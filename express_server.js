const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//////// HELPER FUNCTIONS /////////
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
};

const passwordcheck = (password) => {
  for (let user in users) {
    if (users[user].password === password) {
      return true;
    }
  }
  return false;
};

const idLookup = (email) => {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
  return false;
};

const urlsForUser = (id) => {
  let filteredURL = {};
  for (urls in urlDatabase) {
    if (urlDatabase[urls]["userID"] === id) {
      filteredURL[urls] = urlDatabase[urls];
    }
  }
  return filteredURL;
};
///////// DATABASE /////////
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "aJ48lW": {
    id: "aJ48lW", 
    email: "a@a.com", 
    password: "123"
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
  let templateVars = { 
    urls: urlsForUser(req.cookies["user_id"]),  
    user: users[req.cookies["user_id"]],
  };

  // console.log(templateVars);
  res.render("urls_index", templateVars);
});

// get request to creating new urls
app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase,  user: users[req.cookies["user_id"]] };
  if(!req.cookies["user_id"]) {
    res.redirect("/login");
    return;
  }
  res.render("urls_new", templateVars);
});

// get request to shortURLs
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.cookies["user_id"]] };
  // console.log("this is the shortURL req.params:", req.params.shortURL);
  console.log(templateVars)
  res.render("urls_show", templateVars);
});

// get request longURL redirect
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// registration page 
app.get("/register", (req, res) => {
  let templateVars = { urls: urlDatabase,  user: users[req.cookies["user_id"]] };
  res.render("register", templateVars);
});

// login page
app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase,  user: users[req.cookies["user_id"]] };
  res.render("login", templateVars);
});

///////// POST REQUEST /////////
app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  if (!req.body.longURL.includes("http://")) { // append http to longURL
    req.body.longURL = `http://${req.body.longURL}`;
  }
  console.log(req.body.longURL);

  urlDatabase[newShortURL] = { longURL: req.body.longURL, userID: req.cookies["user_id"] }; // adds a new shortURL to the urlDatabase when submitted in our form
  console.log(urlDatabase);
  res.redirect(`/urls/${newShortURL}`); // redirects to /urls after submission
  // console.log(urlDatabase);
});

// delete urls
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.send("Must login before deleting URL.")
    return;
  };
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// edit urls
app.post("/urls/:id", (req, res) => {
  let editURL = req.body.editURL;
  if (!editURL.includes("http://")) { // append http to longURL
  editURL = `http://${editURL}`;
}
  if (req.cookies["user_id"]) {
    urlDatabase[req.params.id].longURL = editURL;
  };
  res.redirect(`/urls`);
});

// Login route
app.post("/login", (req, res) =>{
  const email = req.body.email;
  const password = req.body.password;
  if (!emailCheck(email)) {
    res.status(403).send("Incorrect email");
  } else if (!passwordcheck(password)) {
    res.status(403).send("Inocrrect password");
  } else {
    res.cookie("user_id", idLookup(email));
    console.log("user logging in ----->", idLookup(email));
  }
  res.redirect("/urls");
});

// Logout route
app.post("/logout", (req, res) =>{
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
    users[id] = { id , email, password };
    // console.log("User object:",users);
    console.log("user register", id);
    res.cookie("user_id", id);
    console.log(users)
    console.log("Cookies --------->", req.cookies["user_id"])
    res.redirect("/urls");
  }
});

///////// SERVER PORT /////////
app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});