//// reqired npm library ////
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

function generateRandomString() {
  let charString = "abcdefghijklmnopqrstuvwxyz0123456789";
  let shortURL = "";
  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * charString.length);
    shortURL += charString[random];
  }
  return shortURL;
}
const newShortURL = generateRandomString();

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//// get request ////
app.get("/", (req, res) => {  // "/" is our root directory
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase };
  res.render("urls_index", templateVars); 
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  // console.log("this is the shortURL req.params:", req.params.shortURL);
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//// post request ////
app.post("/urls", (req, res) => {
  console.log("This is the longURL link", req.body.longURL);
  if(!req.body.longURL.includes("http://")) { // append http to longURL
    req.body.longURL = `http://${req.body.longURL}`;
  }
  urlDatabase[newShortURL] = req.body.longURL; // adds a new shortURL to the urlDatabase when submitted in our form
  res.redirect(`/urls/${newShortURL}`); // redirects to /urls after submission
  console.log(urlDatabase);
});

//// listen ////
app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});