import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";
import axios from "axios";
import "./App.css";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentTrack, setCurrentTrack] = useState();
  const [tabsContent, setTabsContent] = useState();

  function chooseTrack(track) {
    setCurrentTrack(track);
    setSearch("");
  }
  console.log("Search Results:", searchResults);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    let cancel = false;

    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );
          return {
            artist: track.artists[0].name,
            title: track.name,
            albumUrl: smallestAlbumImage.url,
            uri: track.uri,
          };
        })
      );
    });
    return () => {
      cancel = true;
    };
  }, [search, accessToken]);

  useEffect(() => {
    if (!currentTrack) return;
    fetchTabs(currentTrack);
  }, [currentTrack]);

  const fetchTabs = async (currentTrack) => {
    //function to request tabs through the proxy
    console.log("Current Track:", currentTrack);
    try {
      const response = await axios.post(
        "https://riff-ready-2-0-server.vercel.app/api/tab",
        {
          trackName: currentTrack.title,
          artist: currentTrack.artist,
          type: "chord",
        }
      );
      const data = response.data;
      setTabsContent(data); //sets the tabDisplay content to the tab from freetar
      document.getElementById("transpose").innerHTML = 0; //reset the transpose
      //document.getElementById('tabDisplay').scrollBy(0, -1000);//scroll to top of tab
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  return (
    <div className="flex flex-column bg-bg1">
      <Container
        className="d-flex flex-column py-2"
        style={{ height: "100vh" }}
      >
        <Form.Control
          type="search"
          placeholder="Search Songs/Artists"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-headers2 text-text mb-2 focus:bg-headers2"
        />
        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
          {searchResults.map((track) => (
            <TrackSearchResult
              key={track.uri}
              track={track}
              chooseTrack={chooseTrack}
            />
          ))}
        </div>
        <div>
          {tabsContent !=
          '{"error":"Internal Server Error","details":"No tab available"}' ? (
            <div
              id="tabDisplay"
              className="Tab"
              dangerouslySetInnerHTML={{ __html: tabsContent }}
            />
          ) : (
            <div className="noTab">No tab available for current song</div>
          )}
        </div>
        <div className="flex justify-center text-text font-mono overflow-y-hidden mt-20">
          [Intro]
          <br />
          Dmaj7
          <br />
          <br />
          Dmaj7 D6 Dmaj7 D6
          <br />
          <br />
          A A Amaj7 Amaj7
          <br />
          <br />
          [Verse 1]
          <br />
          Dmaj7 D6
          <br />
          I feel close
          <br />
          Dmaj7 D6
          <br />
          Well maybe I'm not, heaven knows
          <br />
          A Amaj7
          <br />
          It's a spotlight stuck on the ceiling
          <br />
          A Amaj7
          <br />
          Why are these the things that I'm feeling?
          <br />
          Dmaj7 D6
          <br />
          There's so much time
          <br />
          Dmaj7 D6
          <br />
          For me to speak up, but I keep quiet
          <br />
          A Amaj7
          <br />
          I'll complicate the most of the mantra
          <br />
          A Amaj7
          <br />
          The power's out and I can't turn the fan on
          <br />
          <br />
          [Chorus]
          <br />
          Dmaj7 D6
          <br />
          So can I call you tonight?
          <br />
          Dmaj7 D6
          <br />
          I'm trying to make up my mind
          <br />
          A Amaj7
          <br />
          Just how I feel
          <br />
          A Amaj7
          <br />
          Could you tell me what's real?
          <br />
          Dmaj7 D6
          <br />
          I hear your voice on the phone
          <br />
          Dmaj7 D6
          <br />
          Now I'm no longer alone
          <br />
          A Amaj7
          <br />
          Just how I feel
          <br />
          A Amaj7
          <br />
          Could you tell me what's real anymore?
          <br />
          <br />
          Cause I wouldn't know
          <br />
          <br />
          [Verse 2]
          <br />
          Dmaj7 D6
          <br />
          Voice so low
          <br />
          Dmaj7 D6
          <br />
          Sneaking around, so it goes
          <br />
          A Amaj7
          <br />
          I always try my best to listen
          <br />
          A Amaj7
          <br />
          Picking up things that I can fidget
          <br />
          Dmaj7 D6
          <br />
          Circle speed
          <br />
          Dmaj7 D6
          <br />
          Pacing around, watching my feet
          <br />
          A Amaj7
          <br />
          Batteries drain, I get the memo
          <br />
          A Amaj7
          <br />
          "I think that I might have to let you go
          <br />
          <br />
          [Chorus]
          <br />
          Dmaj7 D6
          <br />
          So can I call you tonight?
          <br />
          Dmaj7 D6
          <br />
          I'm trying to make up my mind
          <br />
          A Amaj7
          <br />
          Just how I feel
          <br />
          A Amaj7
          <br />
          Could you tell me what's real?
          <br />
          Dmaj7 D6
          <br />
          I hear your voice on the phone
          <br />
          Dmaj7 D6
          <br />
          Now I'm no longer alone
          <br />
          A Amaj7
          <br />
          Just how I feel
          <br />
          A Amaj7
          <br />
          Could you tell me what's real anymore?
          <br />
          <br />
          Cause I wouldn't know
          <br />
          <br />
          [Bridge]
          <br />
          A C#m
          <br />
          <br />
          A C#m
          <br />
          Don't go, don't go so easy
          <br />
          A C#m
          <br />
          Don't go, don't go and leave me
          <br />
          A C#m
          <br />
          Don't go, don't go so easy
          <br />
          A C#m
          <br />
          Don't go, don't go and leave me
          <br />
          A C#m
          <br />
          Don't go, don't go so easy
          <br />
          A C#m
          <br />
          Don't go, don't go and leave me
          <br />
          A C#m
          <br />
          Don't go, don't go so easy
          <br />
          A C#m
          <br />
          Don't go, don't go and leave me
          <br />
          <br />
          [Chorus]
          <br />
          Dmaj7 D6
          <br />
          So can I call you tonight?
          <br />
          Dmaj7 D6
          <br />
          I'm trying to make up my mind
          <br />
          A Amaj7
          <br />
          Just how I feel
          <br />
          A Amaj7
          <br />
          Could you tell me what's real?
          <br />
          Dmaj7 D6
          <br />
          I hear your voice on the phone
          <br />
          Dmaj7 D6
          <br />
          Now I'm no longer alone
          <br />
          A Amaj7
          <br />
          Just how I feel
          <br />
          A Amaj7
          <br />
          Could you tell me what's real anymore?
          <br />
          <br />
          Cause I wouldn't know
        </div>
        <Player
          accessToken={accessToken}
          trackUri={currentTrack?.uri}
          style={{ color: "orange" }}
        />
      </Container>
    </div>
  );
}
