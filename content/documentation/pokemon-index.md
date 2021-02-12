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