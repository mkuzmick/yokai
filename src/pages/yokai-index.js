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
                        <h1>{node.data.Name}</h1>
                        { node.data.canvaCardFront ? "will have a card" : "no card yet"}   
                        <a href={`/yokai/${node.recordId}`}>Click Here</a>
                    </div>
                ))
            }
            <pre>
                {JSON.stringify(allAirtableData, null, 4)}
            </pre>
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