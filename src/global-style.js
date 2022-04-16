import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url("https://use.typekit.net/sjl7giv.css");

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
  code {
    font-size: 14px !important;
  }

  li {
    margin-bottom: calc(1.45rem / 2);
    line-height: 1.5;
  }

  ol li {
    padding-left: 0;
  }
  ul li {
    padding-left: 0;
  }
  li > ol {
    margin-left: 1.45rem;
    margin-bottom: calc(1.45rem / 2);
    margin-top: calc(1.45rem / 2);
  }
  li > ul {
    margin-left: 1.45rem;
    margin-bottom: calc(1.45rem / 2);
    margin-top: calc(1.45rem / 2);
  }

  figcaption {
    text-align: center;
    margin: 0;
    padding: 0;
    padding-top: 0.2rem;
    font-size: 0.75rem;
  }

  img {
    object-fit:cover;
    object-position:center;
  }


@media print {
  html, body {
    font-size: 12px;
  }

  .hide-print {
    display: none;
  }
}
`;
