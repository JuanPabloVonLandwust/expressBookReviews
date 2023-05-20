const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered" });
    } else {
      return res.status(400).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Unable to register user" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  return res.status(200).json(books[req.params.isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const values = Object.values(books);
  const regExp = new RegExp(req.params.author, "i");
  const found = values.filter((book) => regExp.test(book.author));
  if (found.length) {
    return res.status(200).json(found);
  }
  return res.status(404).json({ message: "No such author" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const values = Object.values(books);
  const regExp = new RegExp(req.params.title, "i");
  const found = values.filter((book) => regExp.test(book.title));
  if (found.length) {
    return res.status(200).json(found);
  }
  return res.status(404).json({ message: "No such title" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  return res.status(200).json(books[req.params.isbn].reviews);
});

// Task 10 - getting the list of books available in the shop
public_users.get("/books", async function (req, res) {
  await new Promise(function (resolve, reject) {
    if (Object.keys(books).length) {
      resolve(res.status(200).json(books));
    }
    reject(res.status(404).send({ message: "No books found" }));
  })
    .then(() => console.log("Promise for Task 10 resolved"))
    .catch(() => console.log("Promise for Task 10 rejected"));
});

// Task 11 - getting the book details based on ISBN
public_users.get("/books/isbn/:isbn", function (req, res) {
  const promise = new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    if (book) {
      resolve(res.status(200).send(book));
    }
    reject(res.status(404).send({ message: "No such book" }));
  });
  promise
    .then(() => console.log("Promise for Task 11 resolved"))
    .catch(() => console.log("Promise for Task 11 rejected"));
});

// Task 12 - getting the book details based on Author
public_users.get("/books/author/:author", async function (req, res) {
  await new Promise((resolve, reject) => {
    const values = Object.values(books);
    const regExp = new RegExp(req.params.author, "i");
    const found = values.filter((book) => regExp.test(book.author));
    if (found.length) {
      resolve(res.status(200).json(found));
    }
    reject(res.status(404).json({ message: "No such author" }));
  })
    .then(() => console.log("Promise for Task 12 resolved"))
    .catch(() => console.log("Promise for Task 12 rejected"));
});

// Task 13 - getting the book details based on Title
public_users.get("/books/title/:title", function (req, res) {
  const promise = new Promise((resolve, reject) => {
    const values = Object.values(books);
    const regExp = new RegExp(req.params.title, "i");
    const found = values.filter((book) => regExp.test(book.title));
    if (found.length) {
      resolve(res.status(200).json(found));
    }
    reject(res.status(404).json({ message: "No such title" }));
  });
  promise
    .then(() => console.log("Promise for Task 13 resolved"))
    .catch(() => console.log("Promise for Task 13 rejected"));
});

module.exports.general = public_users;
