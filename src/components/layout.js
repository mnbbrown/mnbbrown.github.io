/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import styled from 'styled-components';
import { Header } from './header';
import { GlobalStyle } from '../global-style';

const ContainerS = styled.div`
  max-width: 650px;
  margin: 0 auto;
  padding: 0 1.75rem;
`;

const FooterS = styled.footer`
  display: block;
`;

const FooterCopyrightS = styled.span`
  text-align: center;
  width: 100%;
  font-size: 0.8rem;
  display: block;
`;

const Layout = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <ContainerS>
        <Header />
        <main>{children}</main>
        <FooterS>
          <FooterCopyrightS>Copyright © Matthew Brown {new Date().getFullYear()}</FooterCopyrightS>
        </FooterS>
      </ContainerS>
    </>
  );
};

export default Layout;
