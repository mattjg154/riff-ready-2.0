import React from "react";
import { Container } from "react-bootstrap";

const REDIRECT_URI = "https://riff-ready-2-0-client.vercel.app/";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=98615042f4214de7b0970c94a4796730&response_type=code&redirect_uri=https://riff-ready-2-0-client.vercel.app&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

export default function Login() {
  return (
    <>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="h-full lg:flex flex-col items-center justify-center px-4">
          <div className="text-center space-y-4 pt-16">
            <h1 className="font-bold text=3xl text-#2E2A47"> Welcome Back!</h1>
            <p className="text-base text-[#7E8CA0]">
              Log in to start playing music.
            </p>
          </div>
          <div className="flex item-center justify-center mt-8">
            <Container className="d-flex justify-content-center align-items-center">
              <a className="btn btn-success btn-lg" href={AUTH_URL}>
                Login With Spotify
              </a>
            </Container>
          </div>
        </div>
        <div className="h-full bg-blue-600 hidden lg:flex items-center justify-center">
          <Image src="/logo.svg" alt="logo" height={100} width={100}></Image>
        </div>
      </div>
    </>
  );
}
