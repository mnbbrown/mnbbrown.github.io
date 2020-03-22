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

module.exports = {
  siteMetadata: {
    title: `Matthew Brown`,
    description: `My little corner of the vast internet`,
    author: `@mnbbrown`,
    siteUrl: 'https://matthewbrown.io',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/content`,
      },
    },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        typekit: { id: 'sjl7giv' },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Matthew Brown`,
        short_name: `Matt Brown`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              disableBgImageOnAlpha: true,
              quality: 80,
              withWebp: true,
              loading: 'auto',
              maxWidth: 1.2 * 650,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.fields.rawDate,
                  url: site.siteMetadata.siteUrl + edge.node.fields.path,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.path,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                });
              });
            },
            query: listPosts,
            output: '/feed.xml',
            title: "Matthew Brown's Blog's RSS Feed",
          },
        ],
      },
    },
  ],
};
