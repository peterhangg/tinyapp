//// reqired npm library ////
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

function generateRandomString() {
  let charArray = "abcdefghijklmnopqrstuvwxyz0123456789";
  let shortURL = "";
  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * charArray.length);
    shortURL += i[random];
  }
  return shortURL;
}

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

//// post request ////

app.post("/urls", (req, res) => {
  console.log(req.body);   // Long the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});


//// listen ////
app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
})