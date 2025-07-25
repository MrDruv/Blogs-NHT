const axios = require("axios");
const fs = require("fs");
const path = require("path");

exports.handler = async (event, context) => {
  const code = event.queryStringParameters.code;
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const REDIRECT_URI = "https://nighthack.in/.netlify/functions/auth-discord";

  // Exchange code for token
  const tokenRes = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI
  }), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  const accessToken = tokenRes.data.access_token;

  // Fetch user info
  const userRes = await axios.get("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const user = userRes.data;

  // Write Hugo-compatible markdown
  const mdDir = path.join(__dirname, "../../content/users", user.id);
  fs.mkdirSync(mdDir, { recursive: true });

  const md = `---
title: "${user.username}"
avatar: "https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png"
discord: "${user.username}#0000"
layout: "user"
joined: "${new Date().toISOString().slice(0, 10)}"
---

Welcome to NightHack blog!
`;

  fs.writeFileSync(path.join(mdDir, "index.md"), md);

  return {
    statusCode: 302,
    headers: {
      Location: `/users/${user.id}/`
    },
    body: ""
  };
};

