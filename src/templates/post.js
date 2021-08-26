import React from 'react';
import styled from 'styled-components';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import SEO from '../components/seo';

const PostTitleS = styled.h1`
  font-size: 2rem;
`;

const PostDateS = styled.span`
  opacity: 0.2;
  display: block;
`;

const PostContentS = styled.div`
  p {
    margin-top: 0;
    margin-bottom: 1.7em;
    line-height: 1.6em;
  }

  .gatsby-resp-image-wrapper {
    width: 120%;
    margin-left: -10% !important;
    padding: 1rem 0;
  }

  .gatsby-highlight {
    margin: 0;
    padding: 0;
    margin-bottom: 1.75rem;
  }

  .gatsby-highlight pre[class*='language-'] {
    font-size: 0.8rem;
    margin-left: -1.75rem;
    width: calc(100% + 3.5rem);
    padding: 1rem;
    overflow: scroll;
  }

  blockquote {
    background-color: #fffaf0;
    font-size: 0.9375rem;
    margin: 1.75rem 0;
    padding: 1em;
  }

  blockquote p:last-child {
    margin-bottom: 0;
  }
`;

const Post = ({ data = {}, location }) => {
  const { markdownRemark: post } = data;

  const description = post.frontmatter.excerpt ? post.frontmatter.excerpt : post.excerpt;
  const image = post.frontmatter.featured && post.frontmatter.featured.image.resize;
  const content = post.html;

  return (
    <Layout>
      <SEO location={location} title={post.frontmatter.title} description={description} image={image} />
      <PostTitleS>
        {post.frontmatter.title}
        <PostDateS>{post.fields.date}</PostDateS>
      </PostTitleS>
      <PostContentS dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
};

export default Post;

export const pageQuery = graphql`
  query PostByPath($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      excerpt(pruneLength: 160)
      fields {
        slug
        date(formatString: "DD MMM YYYY")
        rawDate: date
      }
      frontmatter {
        category
        excerpt
        title
        featured {
          image: childImageSharp {
            resize(width: 1500) {
              height
              width
              src
            }
          }
        }
      }
    }
  }
`;
