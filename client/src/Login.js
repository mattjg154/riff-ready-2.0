import React from "react";
import { Container } from "react-bootstrap";

const REDIRECT_URI = "https://riff-ready-2-0-client.vercel.app/";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=98615042f4214de7b0970c94a4796730&response_type=code&redirect_uri=https://riff-ready-2-0-client.vercel.app/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

export default function Login() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
  );
}
