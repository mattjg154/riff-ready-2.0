const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { JSDOM } = require("jsdom");
const axios = require("axios");
const puppeteer = require("puppeteer");
const chromium = require("chrome-aws-lambda");

dotenv.config();

const app = express();

// Manually set CORS headers for your routes
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://riff-ready-2-0-client.vercel.app"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // send OK status for preflight requests
  }
  next();
});

app.use(bodyParser.json());

// Your routes
app.post("/api/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken,
  });
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });
    })
    .catch(() => {
      res.sendStatus(400);
    });
});

app.post("/api/login", (req, res) => {
  const code = req.body.code;
  console.log("Received code:", code);
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(process.env.REDIRECT_URI);
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/api/tab", async (req, res) => {
  console.log("Received tab request");
  const body = req.body; //gets the data sent from WebPlayback
  let { trackName } = body;
  const { artist } = body;
  const { type } = body;
  trackName = trackName.split("-")[0]; //removes harmful characters
  trackName = trackName.split("(")[0];
  trackName = trackName.split("?")[0];
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  await page.goto(
    `https://www.ultimate-guitar.com/search.php?search_type=title&value=${artist.toLowerCase()}%20${trackName.toLowerCase()}`
  );
  const content = await page.evaluate(() => {
    return document.body.innerHTML;
  });
  console.log(content);
  await browser.close();
  res.send(content);
});

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

module.exports = app;
