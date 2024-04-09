const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const pool = require("./config/db");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const PORT = 4000;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const getUserQuery = `SELECT * FROM vwuser WHERE user_email = '${email}';`;
    const userResult = await pool.query(getUserQuery);

    if (userResult.rows.length === 0) {
      res.status(401).json({ error: "Invalid Email" });
      return;
    }

    const storedHashedPassword = userResult.rows[0].user_password;
    const userId = userResult.rows[0].user_id;
    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

    if (!passwordMatch) {
      res.status(402).json({ error: "Invalid Password" });
      return;
    }

    const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
      expiresIn: "7h",
    });

    const expiryTime = new Date(Date.now() + 7 * 60 * 60 * 1000);

    res.status(200).send({
      status: 200,
      message: "Login successful.",
      token,
      expiryTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/validateUser", async (req, res) => {
  const userId = req.body.userId; // Assuming userId is a property of the request body
  const query = `SELECT user_first_name FROM vwuser WHERE user_id = $1`;
  try {
    const result = await pool.query(query, [userId]);
    if (result.rows.length > 0) {
      // User with the provided user ID exists in the database
      res.status(200).send({ isValid: true });
    } else {
      // User with the provided user ID does not exist in the database
      res.status(401).send({ isValid: false });
    }
  } catch (error) {
    // Handle database query errors
    console.error("Error validating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`BACKEND RUNNING ON ${PORT}`));
