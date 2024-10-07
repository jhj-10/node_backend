const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const mariadb = require("mariadb");
const port = 3000;

app.use(cors());

const pool = mariadb.createPool({
  // host: "localhost",
  // port: 3306,
  host: "svc.sel4.cloudtype.app",
  port: 31849,
  user: "root",
  password: "1234",
  database: "schedule_manager",
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.post("/api/login", async (req, res) => {
  console.log("user login!!!");
  const { email, password } = req.body;
  // const email = "user1@test.com";
  // const password = "rladbwj1!";
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    if (conn) conn.end();
  }
});

app.get("/api/user/:userId", async (req, res) => {
  const { userId } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM users WHERE id = ?", [userId]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching userInfo:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching userInfo" });
  } finally {
    if (conn) conn.end();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
