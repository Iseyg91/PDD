// server.js
const express = require("express");
const fetch = require("node-fetch");
const app = express();

const CLIENT_ID = "1356693934012891176";
const CLIENT_SECRET = "_IE6vn65TN0qbIcmfyFE1T62EhzXWToU";
const REDIRECT_URI = "http://127.0.0.1:5500/pages/index.html";

app.get("/api/discord-oauth", async (req, res) => {
  const code = req.query.code;

  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.access_token) {
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    const userData = await userResponse.json();
    res.json({ success: true, user: userData });
  } else {
    res.json({ success: false, error: "Token exchange failed", details: tokenData });
  }
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
