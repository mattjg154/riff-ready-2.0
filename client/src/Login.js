import React from "react";
import { LogIn } from "lucide-react";

const REDIRECT_URI = "https://riff-ready-2-0-client.vercel.app/";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=98615042f4214de7b0970c94a4796730&response_type=code&redirect_uri=https://riff-ready-2-0-client.vercel.app&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

export default function Login() {
  return (
    <div className="min-h-screen grid grid-cols-[1fr_2fr] grid-rows-2">
      <div className="col-span-1 bg-orange flex items-end justify-center z-20">
        <h1 className="text-8xl font-bold text-white">RiffReady</h1>
      </div>
      <div className="col-span-1 bg-cream"></div>
      <div className="col-span-1 bg-orange flex items-start justify-center">
        <a href={AUTH_URL} className="flex items-center pt-1">
          <button className="text-2xl text-white font-bold  ">Login</button>
          <LogIn className="text-white size-8   mt-1"></LogIn>
        </a>
      </div>
      <div className="col-span-1 bg-cream"></div>
    </div>
  );
}
