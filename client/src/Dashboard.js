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
    console.log("HEllo");
    if (!currentTrack) return;
    else {
      fetchTabs(currentTrack);
    }
  }, [currentTrack?.uri]);

  const fetchTabs = async (currentTrack) => {
    //function to request tabs through the proxy
    console.log("Current Track:", currentTrack);
    try {
      const response = await axios.post(
        "https://riff-ready-2-0-server.vercel.app/api/guitarTab",
        {
          trackName: currentTrack.title,
          artist: currentTrack.artist,
          type: "chord",
        }
      );
      const data = response.data;
      setTabsContent(data); //sets the tabDisplay content to the tab from freetar
      //document.getElementById("transpose").innerHTML = 0; //reset the transpose
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
        <div className="max-h-full flex justify-center">
          {tabsContent ? (
            <div
              id="tabDisplay"
              className="Tab"
              style={{ maxHeight: window.innerHeight - 300 }}
              dangerouslySetInnerHTML={{ __html: tabsContent }}
            ></div>
          ) : (
            <div className="noTab">No tab available for current song</div>
          )}
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
