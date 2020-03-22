import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    color: #1c1c1c;
    background-color: #ffffff;
    font-size: 16px;
    font-family: 'proxima-nova', helvetica, arial, clean, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-size: 100%;
  }

  h1 {
      margin-bottom: 1em
  }

  h2 {
      font-size: 1.2rem
  }

  h4 {
      margin-top: 2rem
  }

  a {
    color: #4078c0;
    text-decoration: underline;
  }

`;
