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
  'https://twitter.com/mnbbrown': [FaTwitter, "Twitter"],
  'https://github.com/mnbbrown': [FaGithub, "Github"],
  'https://au.linkedin.com/in/mnbbrown': [FaLinkedinIn, "LinkedIn"],
  '/feed.xml': [FaRss, "RSS"],
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
        const [Icon, title] = socialLinks[link];
        if (link === '/feed.xml') {
          return (
            <SocialIconS key={link} href={link}>
              {Icon && <Icon title={title} />}
            </SocialIconS>
          );
        }
        return (
          <SocialIconS key={link} rel="noopener noreferrer" target="_blank" href={link}>
            {Icon && <Icon title={title} />}
          </SocialIconS>
        );
      })}
    </SocialIconsS>
  </HeaderS>
);
