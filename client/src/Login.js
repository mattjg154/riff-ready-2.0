import React from "react";
import { LogIn } from "lucide-react";

const REDIRECT_URI = "https://riff-ready-2-0-client.vercel.app/";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=98615042f4214de7b0970c94a4796730&response_type=code&redirect_uri=https://riff-ready-2-0-client.vercel.app&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

export default function Login() {
  return (
    <div className="min-h-screen grid grid-cols-[1fr_2fr] grid-rows-2 max-h-screen">
      <div className="col-span-1 bg-headers2 flex items-end justify-center">
        <h1 className="text-8xl font-bold text-white z-50">RiffReady</h1>
      </div>

      <div className="col-span-1 bg-bg1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-headers2 mt-4">
          Learning Music by Hearing it.
        </h1>
        <p className="text-lg font-bold text-headers mt-4">
          - Log in with Spotify Premium
          <br />- Select a song and start playing along with the app
          <br />- Sit back and let the tabs come to you
        </p>
      </div>
      <div className="col-span-1 bg-headers2 flex items-start justify-center">
        <a
          href={AUTH_URL}
          className="flex items-center pt-1 hover:scale-105 duration-300"
        >
          <button className="text-2xl text-white font-bold  ">Login</button>
          <LogIn className="text-white size-8   mt-1"></LogIn>
        </a>
      </div>
      <div className="col-span-1 bg-bg1 flex items-start justify-center">
        <img
          src={require("./assets/preview.png")}
          className="w-7/12 drop-shadow-xl -mt-24 hover:scale-105 duration-300"
        ></img>
      </div>
    </div>
  );
}
