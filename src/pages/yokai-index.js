/** @jsx jsx */
import { jsx } from 'theme-ui'
import { graphql } from "gatsby"

export default ({data}) => {
    const allAirtableData = data.allAirtable.edges;
    return (
        <div
          sx={{padding: "4em"}}
        >
            {/* <pre>
                {JSON.stringify(allAirtableData, null, 4)}
            </pre> */}
            {
                allAirtableData.map(({node}) => (
                    <div
                      sx={{width: "100%", textAlign: "center"}}
                    >
                        <a href={`/yokai/${node.recordId}`}
                          sx={{
                            // color: "rgba(0,0,30,.9"
                          }}
                        ><h1
                          sx={{
                            fontFamily: "Avenir Next, sans-serif",
                            fontSize: "3em",
                            fontWeight: "900",
                            color: "rgba(0,0,30,.9)",
                            textDecoration: "none"
                          }}
                        >{node.data.Name}</h1></a>
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
              recordId
              data {
                Description
                mainFeature
                Creator
                Link_to_Project
                secondFeature
                Name
                weight
                type
                mainAttack
                region
                specialAttack
                height
                backgroundColor
                foregroundColor
                canvaCardLink
                canvaCardBack {
                  id
                  thumbnails {
                    large {
                      url
                      width
                      height
                    }
                  }
                }
                canvaCardFront {
                  id
                  thumbnails {
                    large {
                      url
                      width
                      height
                    }
                  }
                }
              }
            }
          }
        }
      }
`