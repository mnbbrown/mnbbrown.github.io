/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
//
//
const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require('path');

const draftFilter = `
    filter: {
      frontmatter: { draft: { ne: true }}
    }
  `;

const listPosts = `
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [fields___date] }
      ${process.env.NODE_ENV === 'production' ? draftFilter : ''}
    ) {
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

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;
  const blogPostTemplate = path.resolve(`src/templates/post.js`);

  const query = graphql(listPosts);

  return query.then(result => {
    if (result.errors) {
      return Promise.reject(result);
    }

    const posts = result.data.allMarkdownRemark.edges;
    posts.forEach(({ node }, index) => {
      createPage({
        path: node.fields.path,
        component: blogPostTemplate,
        context: { slug: node.fields.slug },
      });
    });
    return [];
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type MarkdownRemark implements Node @dontInfer {
      frontmatter: Frontmatter!
      fields: MarkdownRemarkFields
    }

    type MarkdownRemarkFields {
      slug: String!
      path: String!
      date: Date @dateformat
    }

    type Frontmatter @infer {
      title: String
      category: String
      draft: Boolean
      excerpt: String
      featured: File @fileByRelativePath
    }
  `;
  createTypes(typeDefs);
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const filename = createFilePath({ node, getNode, basePath: `pages`, trailingSlash: false });
    console.log(filename);
    // get the date and title from the file name
    const [, date, slug] = filename.match(/^\/([\d]{4}-[\d]{2}-[\d]{2})-{1}(.+)$/);
    const date_parts = date.split('-');
    const path = '/' + date_parts.concat([slug]).join('/');
    createNodeField({ node, name: `slug`, value: slug });
    createNodeField({ node, name: `date`, value: date });
    createNodeField({ node, name: `path`, value: path });
  }
};
