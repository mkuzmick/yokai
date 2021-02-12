```
const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `Mdx`) {
    console.log(`found mdx node of type ${node.internal.type}`)
    const fileNode = getNode(node.parent)
    const slugStem = createFilePath({ node, getNode })
    const slugRoot = fileNode.sourceInstanceName
      ? fileNode.sourceInstanceName
      : "content"
    createNodeField({
      node,
      name: `slug`,
      value: `/${slugRoot}${slugStem}`,
    })
    createNodeField({
      node,
      name: `pageType`,
      value: slugRoot,
    })
    createNodeField({
      node,
      name: `title`,
      value: node.frontmatter.title || fileNode.name || "no title",
    })
    createNodeField({
      node,
      name: `mainImage`,
      value: node.frontmatter.mainImage || "/gatsby.jpg",
    })
  }
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const mdxResult = await graphql(`
    query {
      allMdx {
        edges {
          node {
            id
            fields {
              slug
              title
              pageType
            }
            headings(depth: h1) {
              value
            }
          }
        }
      }
    }
  `)

  if (mdxResult.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
  }

  const mdx = mdxResult.data.allMdx.edges
  mdx.forEach(({ node }, index) => {
    console.log(
      `creating page for id ${node.id} with slug ${node.fields.slug} with initial h1 of ${(node.headings && node.headings[0]) ? node.headings[0].value : "no h1"}`
    )
    createPage({
      path: node.fields.slug,
      component: path.resolve(
        `./src/templates/test-layout.js`
      ),
      context: { id: node.id },
    })
  })

  const pokemonResult = await graphql(`
    query {
        allAirtable {
            edges {
                node {
                    id
                    recordId
                }
            }
        }
    }
  `)

  if (pokemonResult.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "pokemon" query')
  }


  const pokemon = pokemonResult.data.allAirtable.edges
  pokemon.forEach(({ node }, index) => {
    console.log(
      `creating page for id ${node.id} with slug /pokemon/${node.recordId} `
    )
    console.log(JSON.stringify(node, null, 4))
    createPage({
      path: `/pokemon/${node.recordId}`,
      component: path.resolve(
        `./src/templates/pokemon-template.js`
      ),
      context: { recordId: node.recordId },
    })
  })

}
```