const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  return users.filter((user) => user.username === username).length > 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  return (
    users.filter(
      (user) => user.username === username && user.password === password
    ).length > 0
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ data: username }, "access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send({ message: "User successfully logged in" });
  }
  return res
    .status(400)
    .json({ message: "Invalid Login. Check username and password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.user.data;
  books[req.params.isbn].reviews[user] = req.body.review;
  return res.status(200).json({ message: `Review of user ${user} submitted` });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.user.data;
  delete books[req.params.isbn].reviews[user];
  return res.status(200).json({ message: `Review of user ${user} deleted` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
