import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import "./App.css";

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    setPlay(true);
    console.log("hello", trackUri);
  }, [trackUri]);
  return (
    <SpotifyPlayer
      styles={{
        bgColor: "#E98074",
      }}
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) setPlay(false);
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
    ></SpotifyPlayer>
  );
}
