import gql from 'graphql-tag'

export const TaskType = gql`
  type TaskType {
    name: String
    description: String
  }
`
