import React from 'react';
import { graphql } from 'gatsby';

import styled from 'styled-components';
import Link from '../components/link';
import Layout from '../components/layout';
import SEO from '../components/seo';

const PostListS = styled.ul`
  list-style-type: none;
  margin-bottom: 2em;
  padding-left: 0;
`;

const PostS = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.5;
  display: flex;
  align-items: baseline;
`;

const PostNameS = styled(Link)`
  display: inline-block;
  flex: 1;
`;

const PostDateS = styled.span`
  margin-right: 1rem;
  color: #aaa;
  font-family: Monaco, 'Courier New', monospace;
  font-size: 85%;
`;

const Post = ({ title, date, path, external }) => (
  <PostS>
    <PostNameS to={path}>{title}</PostNameS>
    <PostDateS>{date}</PostDateS>
  </PostS>
);

const PostListing = ({ title, posts }) => (
  <>
    <h1>{title}</h1>
    <PostListS>
      {posts.map(post => (
        <Post key={post.fields.slug} date={post.fields.date} title={post.frontmatter.title} path={post.fields.path} />
      ))}
    </PostListS>
  </>
);

const IndexPage = ({ data }) => {
  const by_categories = data.allMarkdownRemark.edges
    .map(result => result.node)
    .reduce(
      (result, post) => ({
        ...result,
        [post.frontmatter.category || 'unknown']: result[post.frontmatter.category || 'unknown']
          ? [...result[post.frontmatter.category || 'unknown'], post]
          : [post],
      }),
      {},
    );
  const category_headlines = {
    notes: 'Notes & How Tos',
    travel: 'Travel',
    recipies: 'Recipes & Cooking Notes'
  };

  const category_listing = Object.keys(category_headlines).map(key => (
    <PostListing key={key} title={category_headlines[key]} posts={by_categories[key] || []} />
  ));

  return (
    <Layout>
      <SEO title="Home" />
      {category_listing}
    </Layout>
  );
};

const draftFilter = `
    filter: {
      frontmatter: { draft: { ne: true }}
    }
  `;

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [fields___date] }) {
      edges {
        node {
          id
          html
          excerpt
          fields {
            path
            slug
            rawDate: date
            date(formatString: "DD MMM YYYY")
          }
          frontmatter {
            title
            draft
            category
          }
        }
      }
    }
  }
`;

export default IndexPage;
