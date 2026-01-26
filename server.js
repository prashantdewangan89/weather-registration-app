const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const USERS_DB = path.join(__dirname, "users.json");
const ADMIN_DB = path.join(__dirname, "admin.json");

// ---------- USER JSON FUNCTIONS ----------

function readUsers() {
  try {
    const data = fs.readFileSync(USERS_DB, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

function writeUsers(data) {
  fs.writeFileSync(USERS_DB, JSON.stringify(data, null, 2));
}

// ---------- ADMIN JSON FUNCTION ----------

function readAdmin() {
  try {
    const data = fs.readFileSync(ADMIN_DB, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log("Admin file read error:", err);
    return null;
  }
}

// ---------- REGISTER API ----------

app.post("/api/register", (req, res) => {
  const { name, gender, email, phone, country } = req.body;

  if (!name || !gender || !email || !phone || !country) {
    return res.json({ success: false, message: "All fields required" });
  }

  const users = readUsers();

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.json({ success: false, message: "User already exists" });
  }

  users.push({
    name,
    gender,
    email,
    phone,
    country,
    time: new Date().toISOString()
  });

  writeUsers(users);
  res.json({ success: true });
});

// ---------- GET USERS ----------

app.get("/api/users", (req, res) => {
  res.json(readUsers());
});

// ---------- DELETE USER ----------

app.delete("/api/users/:email", (req, res) => {
  let users = readUsers();
  users = users.filter(u => u.email !== req.params.email);
  writeUsers(users);
  res.json({ success: true });
});

// ---------- CLEAR ALL USERS ----------

app.delete("/api/clear", (req, res) => {
  writeUsers([]);
  res.json({ success: true });
});

// ---------- ADMIN LOGIN API ----------

app.post("/api/admin/login", (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = readAdmin();
    if (!admin) {
      return res.status(500).json({ success: false, message: "Admin file error" });
    }

    if (email === admin.email && password === admin.password) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------- SERVER ----------

app.listen(PORT, () => {
  console.log(`🔥 Server running → http://localhost:${PORT}`);
});
