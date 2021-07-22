import React from "react";
import { graphql, Link, navigate } from "gatsby";

function postDate(iso) {
  const dateObj = new Date(iso);
  return dateObj.toLocaleDateString();
}

const BlogIndex = ({ data }) => {
  return (
    <>
      <div className="twinkling" />
      <div className="background-blurrer">
        <div className="blog-index-wrapper">
          <h1>Blog Entries</h1>
          {data.allMarkdownRemark.edges.map((edge, i) => (
            <div
              className="post-summary-container"
              key={i}
              onClick={() => navigate(edge.node.frontmatter.slug)}
            >
              <Link to={edge.node.frontmatter.slug}>
                <h2>{edge.node.frontmatter.title}</h2>
              </Link>
              <div className="date">{postDate(edge.node.frontmatter.date)}</div>
              <div className="author">{edge.node.frontmatter.author}</div>
              <p>{edge.node.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export const query = graphql`
  {
    allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            author
            date
            slug
            title
          }
        }
      }
    }
  }
`;

export default BlogIndex;
