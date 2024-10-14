const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const corsOptions = {
  origin: "https://riff-ready-2-0-client.vercel.app", // explicitly allow your frontend origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // allowed HTTP methods
  credentials: true, // allow cookies or authorization headers if needed
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

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
  console.log(req.body);
  const code = req.body.code;
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
      res.sendStatus(400);
    });
});

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

module.exports = app;
