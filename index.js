const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Läs befintlig data från users.json om filen finns
let users = [];
try {
  const data = fs.readFileSync("users.json", "utf8");
  if (data) {
    users = JSON.parse(data);
  }
} catch (err) {
  console.error("Fel vid läsning av filen:", err);
}

// Route för att skicka HTML-formuläret till klienten
app.get("/", (req, res) => {
  let output = "";
  if (users && users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      output += `<p><b>${users[i].Name}</b> från ${
        users[i].Homepage || "ingen hemsida"
      } skriver: <br>${users[i].Comment}</p>`;
    }
  }
  let html = fs.readFileSync(__dirname + "/index.html").toString();
  html = html.replace("GÄSTER", output);
  res.send(html);
});

// Route för att hantera POST-förfrågningar från formuläret
app.post("/submit", (req, res) => {
  const { Name, Homepage, Comment } = req.body;
  users.push({ Name, Homepage, Comment });

  // Skriv användarinformationen till users.json-filen
  fs.writeFile("users.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error("Fel vid skrivning till filen:", err);
      return res.status(500).send("Serverfel");
    }
    res.redirect("/");
  });
});

// Route för att visa alla användare
app.get("/users", (req, res) => {
  res.json(users);
});

let logins = [];
try {
  const data = fs.readFileSync("login.json", "utf8");
  if (data) {
    logins = JSON.parse(data);
  }
} catch (err) {
  console.error("Fel vid läsning av filen login.json:", err);
}

// Route för att skicka login-formuläret till klienten
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

// Route för att hantera POST-förfrågningar från submit-formuläret
app.post("/submit", (req, res) => {
  const { Name, Homepage, Comment } = req.body;
  users.push({ Name, Homepage, Comment });

  // Skriv användarinformationen till users.json-filen
  fs.writeFile("users.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error("Fel vid skrivning till filen users.json:", err);
      return res.status(500).send("Serverfel");
    }
    res.redirect("/");
  });
});

// Route för att visa alla användare
app.get("/users", (req, res) => {
  res.json(users);
});

// Route för att hantera POST-förfrågningar från login-formuläret
app.post("/login", (req, res) => {
  const { username, Password } = req.body;

  // Jämför användarnamn och lösenord med de som finns i din login.json-fil
  const user = logins.find(
    (u) => u.Användarnamn === username && u.Lösenord === Password
  );

  if (user) {
    return res.redirect("/");
  } else {
    res.send("Fel användarnamn eller lösenord.");
  }
});

// Starta servern på port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
