import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";

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
      const apiURL = "https://riff-ready-2-0-server.vercel.app/api/tab";
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackName: currentTrack.name,
          artist: currentTrack.artists[0].name,
          type: "chord",
        }),
      }); //parses track name, artist and type (chord/tab)
      const data = await response.text();
      setTabsContent(data); //sets the tabDisplay content to the tab from freetar
      document.getElementById("transpose").innerHTML = 0; //reset the transpose
      //document.getElementById('tabDisplay').scrollBy(0, -1000);//scroll to top of tab
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
            style={{ maxHeight: window.innerHeight }}
            dangerouslySetInnerHTML={{ __html: tabsContent }}
          />
        ) : (
          <div className="noTab">No tab available for current song</div>
        )}
      </div>
      <Player accessToken={accessToken} trackUri={currentTrack?.uri} />
    </Container>
  );
}
