import gql from 'graphql-tag'

export const StepList = gql`
  type StepList {
    items: [Step]
    total: Int
  }
`
