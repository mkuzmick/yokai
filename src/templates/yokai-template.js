import React from 'react'
import { graphql } from 'gatsby'

export default ({ data }) => {

    return (
    <div>
        <pre>{JSON.stringify(data, null, 4)}</pre>
        <h1>{data.airtable.data.Name}</h1>
        <img src={ data.airtable.data.canvaCardFront ? data.airtable.data.canvaCardFront[0].thumbnails.large.url : "/static/_images/gatsby.jpg"}  />
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
}`