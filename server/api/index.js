const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { JSDOM } = require("jsdom");
const axios = require("axios");

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

app.post("/api/guitarTab", async (req, res) => {
  console.log("Received tab request");
  const body = req.body; //gets the data sent from WebPlayback
  let { trackName } = body;
  const { artist } = body;
  const { type } = body;
  trackName = trackName.split("-")[0]; //removes harmful characters
  trackName = trackName.split("(")[0];
  trackName = trackName.split("?")[0];
  const apiURL = `https://www.ultimate-guitar.com/search.php?search_type=title&value=${artist.toLowerCase()}%20${trackName.toLowerCase()}`;
  try {
    const response = await axios.get(apiURL, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = response.data; //gets data from freetar search page
    const dom = new JSDOM(data);
    const document = dom.window.document;
    const jsStoreDiv = document.querySelector(".js-store");
    const dataContent = jsStoreDiv.getAttribute("data-content");
    const parsedData = JSON.parse(dataContent);
    const results = parsedData.store.page.data.results || [];
    const tabUrls = results
      .filter((result) => result.tab_url.includes(type))
      .map((result) => result.tab_url);

    if (tabUrls.length > 0) {
      const tabUrl = tabUrls[0];
      const tabResponse = await axios.get(tabUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const tabData = tabResponse.data;
      const tabDom = new JSDOM(tabData);
      const tabDoc = tabDom.window.document;
      const tabJsStore = tabDoc.querySelector(".js-store");
      const tabContent = tabJsStore.getAttribute("data-content");
      const tabParsedData = JSON.parse(tabContent);
      const tabResults = tabParsedData.store.page.data.tab_view;
      console.log(tabResults);
      res.send(tabParsedData);
    } else {
      res.status(400).json({ error: "No tab found" });
    }
  } catch (error) {
    console.error("Error during proxy request:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
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
  const apiURL =
    "https://freetar.de/search?search_term=" +
    artist.toLowerCase() +
    " " +
    trackName.toLowerCase(); //searches with artist name and song
  let hrefVal;
  let hrefValSet = false;
  let highestRating = "";
  try {
    const response = await axios.get(apiURL, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data; //gets data from freetar search page
    const dom = new JSDOM(data);
    const document = dom.window.document;
    const links = document.querySelectorAll("a").forEach((link) => {
      //iterates through each link on the page
      if (link.href.includes("tab") && link.href.includes(type)) {
        //if it is a freetar link and is of the correct type tab/chord
        if (hrefValSet == false) {
          //if it is the first valid link
          hrefVal = link.href;
          hrefValSet = true;
          highestRating = link.parentNode.parentNode
            .querySelector(".rating")
            .textContent.split("(")[1]; //sets highest rating to the amount of ratings it has
          highestRating = highestRating.split(")")[0]; //gets it to just the number so it can be compared as an int
        } else {
          // if it isnt the first valid link
          let rating = link.parentNode.parentNode
            .querySelector(".rating")
            .textContent.split("(")[1]; //set rating to the amount of ratings
          rating = rating.split(")")[0];
          if (parseInt(rating) > parseInt(highestRating)) {
            //compare the current rating with the highest
            hrefVal = link.href; // and if it has more reviews then it replaces the current link
            highestRating = rating;
          }
        }
      }
    });
    const tabURL = "https://freetar.de" + hrefVal; //creates link for the tab to be accessed
    if (hrefValSet) {
      //if a valid link was found
      try {
        const response2 = await axios.get(tabURL, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data2 = response2.data;
        const dom2 = new JSDOM(data2);
        const document2 = dom2.window.document;
        const tab = document2.querySelector(".tab").innerHTML; //gets the html content for the tabs
        res.send(tab); //sends it back to WebPlayback to then be displayed
      } catch (error) {
        console.error("Error during proxy request:", error);
        res
          .status(500)
          .json({ error: "Internal Server Error", details: error.message });
      }
    } else {
      //if no valid link found
      res
        .status(500)
        .json({ error: "Internal Server Error", details: "No tab available" });
    }
  } catch (error) {
    console.error("Error during proxy request:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

module.exports = app;
