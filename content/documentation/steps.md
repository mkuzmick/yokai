
- `gatsby new yokai`
- connect to Github repo
- connect to Netlify 
- siteMetadata
- create `/content` and move `/src/images` to `/content/images`
- 


- install the [gatsby-plugin-mdx](https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/?=mdx) and [gatsby-remark-images](https://www.gatsbyjs.com/plugins/gatsby-remark-images/?=remark%20images) plugins:
  ```
  npm install gatsby-remark-images gatsby-plugin-sharp gatsby-plugin-mdx @mdx-js/mdx @mdx-js/react
  ```

* in `gatsby-config.js`, add the `gatsby-remark-images` plugin and the `gatsby-plugin-mdx` (also adding the `gatsby-remark-images` plugin _within_ the `gatsby-plugin-mdx` object too). If you want the `mdx` plugin to handle `.md` file extensions too, add a line to options specifying that:
  ```
  `gatsby-remark-images`,
  {
    resolve: `gatsby-plugin-mdx`,
    options: {
      extensions: [`.mdx`, `.md`],
      // add default layouts once you have them
      // defaultLayouts: {
      //  resources: require.resolve("./src/components/layouts/mdx-layout-resource.js"),
    //  default: require.resolve("./src/components/layouts/mdx-layout-basic.js"),
    },
    gatsbyRemarkPlugins: [
      {
        resolve: `gatsby-remark-images`,
        options: {
          maxWidth: 960,
        },
      },
    ],
  },
  ```



### AIRTABLE


`npm i gatsby-source-airtable` 
then add to `gatsby-config.js`
```
{
      resolve: "gatsby-source-airtable",
      options: {
        apiKey: process.env.AIRTABLE_API_KEY,
        tables: [
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Pokémon",
          },
        ]
      }
    },
```
and also after `npm i dotenv`
put this at top of config
```
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
```
and create `.env.development` with 
```
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_NAME={OPTIONAL}
```




  ```
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `yokai`,
      path: `${__dirname}/content/yokai`,
    },
  },
  ```
- once you do this, you SHOULD be able to see all of your md or mdx files using the GraphiQL tool at [http://localhost:8000/\_\_\_graphql](http://localhost:8000/___graphql). If you are doing this for the first time, it pays to poke around a bit at this stage, creating some queries that help you try out various options for `allMarkdownRemark` and/or `allMdx` queries.
- one quick note: if you have copied in any MDX files that are importing from packages you haven't yet installed, you'll need to install them. For today's project
  ```
  npm i theme-ui react-compare-image
  ```

#### ADD STATIC FOLDER

In general, we will use GraphQL to grab gatsby-processed content from our content folder, but from time to time we may need to use static assets (an initial use case we encountered involved `react-compare-image`). Let's prefix all of the folders we put in static with an `_` so that we don't run into naming collisions.

```
mkdir static static/_images
curl -o static/_images/gatsby.jpg "https://i.guim.co.uk/img/media/cc5ff87a032ce6e4144e63a2a1cbe476dbc7cd5a/273_0_3253_1952/master/3253.jpg?width=620&quality=45&auto=format&fit=max&dpr=2&s=d8da5fd430d3983dc50543a44b3979d4"
```

### ADD MDX AND MD FILES AS PAGES (POSTPONED)

first create a slug for each node. Since we'll be grabbing mdx and md files from multiple sources (`resources`, `shows`, etc), we're going to hold on to that string and add it to the url. We do this in `gatsby-node.js` with something like

```
 const { createFilePath } = require(`gatsby-source-filesystem`)

 exports.onCreateNode = ({ node, getNode, actions }) => {
     const { createNodeField } = actions
     if (node.internal.type === `Mdx`) {
         console.log(`found mdx node of type ${node.internal.type}`)
         const fileNode = getNode(node.parent)
         const slugStem = createFilePath({ node, getNode })
         const slugRoot = fileNode.sourceInstanceName ? fileNode.sourceInstanceName : "content"
         createNodeField({
             node,
             name: `slug`,
             value: `/${slugRoot}${slugStem}`,
         })
       }
   }
```

You can now perform your `allMdx` query again in your [http://localhost:8000/\_\_\_graphql](http://localhost:8000/___graphql).

- then create pages for each node.
- create an initial test layout in `src/templates/test-layout.js` (note—this code is just to get us started—it will not work as is)

  ```
  mkdir src/templates
  touch src/templates/test-layout.js
  ```

  then

  ```
  import React from "react"
  import Layout from "../components/layout"

  export default function TestLayout() {
    return (
      <Layout>
        <div>Hello resource layout</div>
      </Layout>
    )
  }
  ```

The `gatsby-node.js` in this project currently looks like this

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
}

```

then the layout needs to actually handle the data.

here's the test-layout.js right now:

```
import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Link } from "gatsby"
import Seo from "../components/layout/seo-mdx"
import { Styled } from "theme-ui"

const shortcodes = { Link } // Provide common components here

function replacer(key, value) {
  // Filtering out properties
  if (key === 'body') {
    return `${value.substring(0, 32)} . . .`;
  }
  return value;
}

export default function PageTemplate({ data: { mdx } }) {
  return (
    <div
      style={{
        padding: "1em",
        width: "90%",
        margin: "auto"
      }}
    >
      <Seo image={mdx.fields.mainImage} />
      <Styled.h1>{mdx.fields.title}</Styled.h1>
      <p>got your mdx right here</p>
      <Styled.pre>{JSON.stringify(mdx, replacer, 4)}</Styled.pre>
      <p>but here's how it will actually look once parsed...</p>
      <MDXProvider components={shortcodes}>
        <MDXRenderer>{mdx.body}</MDXRenderer>
      </MDXProvider>
    </div>
  )
}

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      fileAbsolutePath
      fields {
        slug
        pageType
        title
        mainImage
      }
      excerpt
      tableOfContents
      timeToRead
    }
  }
`
```

and it imports this seo-mdx component

```
/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({ description, lang, meta, title, image }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:image`,
          content: image || "/gatsby.jpg",
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata?.author || ``,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO

```

### ADD STYLES WITH THEME-UI

- install [gatsby-plugin-theme-ui](https://www.gatsbyjs.com/plugins/gatsby-plugin-theme-ui/?=theme-ui) . one option =
  ```
  npm i theme-ui gatsby-plugin-theme-ui @theme-ui/presets normalize.css
  ```
- then add it to `gatsby-config.js` (note: this will immediately apply the theme . . . even if you haven't created themeproviders in your code yet)

  ```
  'gatsby-plugin-theme-ui',
  ```

- make the shadow dir and add index
  ```
  mkdir src/gatsby-plugin-theme-ui
  echo "export default {}" > src/gatsby-plugin-theme-ui/index.js
  ```
- we then need to add some elements to the theme, for instance:

  ```
  import baseTheme from "@theme-ui/preset-funk"
  import { merge } from "theme-ui"

  export default merge(baseTheme, {
      colors: {
          text: "#AAA",
          background: "#222",
          primary: "#639",
          secondary: "#ff6347",
          headerBackground: "rgba(0, 0, 20, .7)"
        },
      fontWeights: {
          body: 400,
          heading: 900,
          bold: 700,
      },
      lineHeights: {
          body: 1.5,
          heading: 1.125,
      },
      fontSizes: [10, 14, 18, 24, 32, 48, 72, 96, 144],
      styles: {
          h1: {
            fontFamily: "heading",
            fontWeight: "heading",
            lineHeight: "heading",
            marginTop: 0,
            marginBottom: 3,
          //   fontSize: 2,
          //   color: "red"
          },
          a: {
            color: "primary",
            ":hover, :focus": {
              color: "secondary",
            },
          },
        },
  })
  ```

#### PRE STYLING

Change the width of the pre styling

```
pre: {
  overflow: "auto",
  width: "100%",
},
```

### ADD FONTS

- npm install @fontsource/prompt
  ```
  npm install @fontsource/abril-fatface
  ```

* then add the import statements to your theme
  ```
  import '@fontsource/abril-fatface'
  ```
* then add these fonts and reference them in your styles

  ```
  fonts: {
      heading: "Abril Fatface, serif",
      monospace: "Menlo, monospace",
  },
  styles: {
      h1: {
      fontFamily: "heading",
      // etc.
      }
  }
  ```

### AIRTABLE (POSTPONED)

loosely following [this tutorial](https://dev.to/sethu/how-to-build-a-website-using-gatsby-airtable-in-30-mins-42gm) but some of the syntax has changed.

```
npm i gatsby-source-airtable dotenv
```

then create a `.env` with the relevant stuff

```
touch .env.development
```

or if there's something from yesterday

```
cp ../mk-gatsby-20210121/.env.development .env.development
```

```
clip /Users/mk/Development/mk-gatsby-20210129/.env.development
```

then paste that in.

then in `gatsby-config.js` add the [gatsby-source-airtable](https://www.gatsbyjs.com/plugins/gatsby-source-airtable/) plugin

```
{
  resolve: "gatsby-source-airtable",
  options: {
    apiKey: process.env.AIRTABLE_API_KEY,
    tables: [
      {
        baseId: process.env.AIRTABLE_BASE_ID,
        tableName: "Pokémon",
      },
    ]
  }
},

```

and use `dotenv` to bring in environment variables if desired (note: if hosting on netlify you'll have to enter them there too.)

```
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
```

and if doing pokemon, here is the pokemon index.

```
import React from "react"
import { graphql } from "gatsby"

export default ({data}) => {
    const allAirtableData = data.allAirtable.edges;
    return (
        <div>
            {/* <pre>
                {JSON.stringify(allAirtableData, null, 4)}
            </pre> */}
            {
                allAirtableData.map(({node}) => (
                    <div>
                        <img alt={node.data.Name} src={node.data.Sprites[0].url} />
                        <h1>{node.data.Name}</h1>
                        <a href={`/pokemon/${node.recordId}`}>Click Here</a>
                    </div>
                ))
            }
        </div>
    )
}

export const query = graphql`
    query {
        allAirtable {
            edges {
              node {
                id
                data {
                  Name
                  APIURL
                  Height
                  Base_Experience
                  Weight
                  HP
                  Attack
                  Defense
                  Speed
                  Special_Defense
                  Special_Attack
                  Description
                  ID
                  Updated
                  TimeDiff
                  Sprites {
                    url
                  }
                }
                recordId
              }
            }
          }
    }
`

```

### CREATING AIRTABLE PAGES (POSTPONED)

now we add an additional query and then map the array of results to pages:

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

but then we also need the pokemon-template.js:

```
import React from 'react'
import { graphql } from 'gatsby'

export default ({ data }) => {

    return (
    <div>
        <pre>{JSON.stringify(data, null, 4)}</pre>
        <h1>{data.airtable.data.Name}</h1>
        <img src={data.airtable.data.Sprites[0].url} />
    </div>
    )
}

export const query = graphql`
query GetRecord($recordId: String!){
    airtable(recordId: { eq: $recordId}) {
        id
        table
        recordId
        data {
            Name
            APIURL
            Height
            Base_Experience
            Weight
            HP
            Attack
            Defense
            Speed
            Special_Defense
            Special_Attack
            Description
            ID
            Updated
            TimeDiff
            Sprites {
            url
            }
        }
    }
}`
```

### CARDS

- create `card-flip.js` file with a CardFlip component you export:

```
import React, { useState } from "react"

const CardFlip = (props) => {
    return (
        <div>
            Card will go here eventually
        </div>
    )
}

export default CardFlip
```

- import this in your MDX just to make sure everything's hooked up OK. Create a new mdx file in pages called `cards.mdx` or similar, and add the following to get started

```
import CardFlip from "../components/card-flip"

# CARDS THAT FLIP

<CardFlip />
```

- now that we can easily preview our work, let's go back to `card-flip.js` and start building it out. For starteds, let's create a styled div for the card.

```
/** @jsx jsx */

import { useState } from "react"
import { jsx, Container } from "theme-ui"
import ClickMe from "../../../content/svg/click-black-and-white.svg"

const Click = () => (
    <div
        sx={{
            margin: "auto",
            padding: "50px"
        }}
    >
        <ClickMe />
    </div>
)
const Front = (props) => (
    <div
    sx={{
        backgroundColor: "rgba(10, 60, 175, 0.9)",
        color: "white",
        position: "absolute",
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        overflow: "hidden"
    }}
    >
        {(props.image && <img alt="click me" src={props.image}/>) || props.text || <Click />}
    </div>
)

const Back = (props) => (
    <div
        sx={{
            backgroundColor: "dodgerblue",
            color: "white",
            transform: "rotateY(180deg)",
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            overflow: "hidden"
        }}
    >
        <Container>
            {(props.image && <img src={props.image}/>) || props.text || <Click />}
        </Container>

    </div>
)

const OuterCardContainer = (props) => (
    <div
        sx={{
            backgroundColor: "transparent",
            height: "200px",
            width: "350px",
            perspective: "1000px",
        }}
    >
        {props.children}
    </div>
)

const InnerCardContainer = (props) => (
    <div
            className="card-class"
            sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    transform: props.flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transformStyle: "preserve-3d",
                    //   bg: flipped ? `rgba(0,32, 255, 0.7)` : `rgba(255,0,53,0.9)`,
                    //   color: `white`,
                    fontFamily: `Abril Fatface`,
                    transition: "background-color 1s ease, transform .5s",
            }}
            onClick={props.onClick}
            role="button"
    >
        {props.children}
    </div>
)

const CardFlip = props => {
  const [isFlipped, setFlip] = useState(false)
  function flip() {
    console.log(`flipping from ${isFlipped} to ${!isFlipped}`)
    setFlip(!isFlipped)
  }
  return (
    <div
        sx={{
            width: "500px",
            height: "400px",
            padding: "75px"
        }}
    >
        <OuterCardContainer>
            <InnerCardContainer
                flipped={isFlipped}
                onClick={flip}
            >
                {props.children}
            </InnerCardContainer>
        </OuterCardContainer>
    </div>
  )
}

export default { CardFlip, Front, Back }
export { CardFlip, Front, Back }
```

note. if using the svg we need to install 

```
npm install --save gatsby-plugin-react-svg
```

then add to gatsby-config

```
{
    resolve: "gatsby-plugin-react-svg",
    options: {
      rule: {
        include: /svg/ // See below to configure properly
      }
    }
  }
```



## NEXT



next up = change to this sort of syntax:

```
<CardFlip front="click me" back="/_images/gatsby.jpg" />
```

### LINKS TO CHECK OUT:

- https://freefrontend.com/css-flip-cards/
- https://uicookies.com/css-card-flip/
- https://1stwebdesigner.com/learn-how-to-create-flip-cards-using-css/
- https://www.w3schools.com/howto/howto_css_flip_card.asp


### MORE THEME-UI

- [linked headings](https://theme-ui.com/guides/linked-headings) with theme-ui
- [layouts on theme-ui](https://theme-ui.com/guides/layouts)

### TEMPLATES

- where templates go and why
- more on providers (and stock components for thems)

### NETLIFY STATUS

is this useful?

[![Netlify Status](https://api.netlify.com/api/v1/badges/2da80c54-9062-4114-b5e0-e25e3b5e40c5/deploy-status)](https://app.netlify.com/sites/mk-gatsby-20210121/deploys)

Let's see.

### THEMES

tutorial on [using multiple themes](https://www.gatsbyjs.com/tutorial/using-multiple-themes-together)

### MODELS

- [state of european tech](https://2017.stateofeuropeantech.com/chapter/introduction/) has cool navigation for documentation.


```
import React from 'react'
import { graphql } from 'gatsby'

export default ({ data }) => {

    return (
    <div>
        <pre>{JSON.stringify(data, null, 4)}</pre>
        <h1>{data.airtable.data.Name}</h1>
        <img src={data.airtable.data.Sprites[0].url} />
    </div>
    )
}

export const query = graphql`
query GetRecord($recordId: String!){
    airtable(recordId: { eq: $recordId}) {
        id
        table
        recordId
        data {
            Name
            APIURL
            Height
            Base_Experience
            Weight
            HP
            Attack
            Defense
            Speed
            Special_Defense
            Special_Attack
            Description
            ID
            Updated
            TimeDiff
            Sprites {
            url
            }
        }
    }
}`
```

