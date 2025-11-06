// server.js
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000; // Backend runs on this port

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🧠 Connect to MySQL Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",     // change if you set a password
  password: "",     // enter your MySQL password here
  database: "herelegance_db"
});

// ✅ Check database connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL successfully!");
  }
});

// 🧩 Create Tables (only run once)
app.get("/create-tables", (req, res) => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255)
    )
  `;

  const cartTable = `
    CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_email VARCHAR(255),
      product_name VARCHAR(255),
      price INT
    )
  `;

  db.query(usersTable);
  db.query(cartTable);
  res.send("Tables created successfully!");
});

// 🧩 Signup API
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Signup failed. Email may already exist.");
      } else {
        res.send("User registered successfully!");
      }
    }
  );
});

// 🧩 Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        res.status(500).send("Error checking user");
      } else if (result.length > 0) {
        res.send("Login successful!");
      } else {
        res.status(401).send("Invalid credentials");
      }
    }
  );
});

// 🧩 Add to Cart
app.post("/add-to-cart", (req, res) => {
  const { user_email, product_name, price } = req.body;
  db.query(
    "INSERT INTO cart (user_email, product_name, price) VALUES (?, ?, ?)",
    [user_email, product_name, price],
    (err, result) => {
      if (err) {
        res.status(500).send("Failed to add item to cart");
      } else {
        res.send("Item added to cart successfully!");
      }
    }
  );
});

// 🧩 Get Cart Items
app.get("/cart/:email", (req, res) => {
  const userEmail = req.params.email;
  db.query("SELECT * FROM cart WHERE user_email = ?", [userEmail], (err, rows) => {
    if (err) {
      res.status(500).send("Error fetching cart");
    } else {
      res.json(rows);
    }
  });
});

// 🧩 Remove from Cart
app.delete("/cart/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM cart WHERE id = ?", [id], (err, result) => {
    if (err) {
      res.status(500).send("Failed to remove item");
    } else {
      res.send("Item removed from cart!");
    }
  });
});

// 🧩 Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
