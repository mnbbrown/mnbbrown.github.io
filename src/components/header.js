import React from 'react';
import styled from 'styled-components';
import Link from './link';
import { FaLinkedinIn, FaGithub, FaRss, FaTwitter } from 'react-icons/fa';

const HeaderS = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SocialIconsS = styled.div`
  text-align: right;
  margin: 1.1rem 0;
  line-height: 1.6;
`;

const SocialIconS = styled(Link)`
  color: inherit;
  margin-left: 10px;
  display: inline-block;
`;

const socialLinks = {
  'https://twitter.com/mnbbrown': FaTwitter,
  'https://github.com/mnbbrown': FaGithub,
  'https://au.linkedin.com/in/mnbbrown': FaLinkedinIn,
  '/feed.xml': FaRss,
};

export const Header = () => (
  <HeaderS>
    <Link to="/" style={{ color: 'inherit' }}>
      <h1 style={{ display: 'inline-block' }}>
        Matthew Brown<span style={{ opacity: 0.2 }}>&apos;s Blog</span>
      </h1>
    </Link>
    <SocialIconsS>
      {Object.keys(socialLinks).map(link => {
        const Icon = socialLinks[link];
        if (link === '/feed.xml') {
          return (
            <SocialIconS key={link} href={link}>
              {Icon && <Icon />}
            </SocialIconS>
          );
        }
        return (
          <SocialIconS key={link} rel="noopener noreferrer" target="_blank" href={link}>
            {Icon && <Icon />}
          </SocialIconS>
        );
      })}
    </SocialIconsS>
  </HeaderS>
);
