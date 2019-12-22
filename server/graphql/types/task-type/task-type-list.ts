import gql from 'graphql-tag'

export const TaskTypeList = gql`
  type TaskTypeList {
    items: [TaskType]
    total: Int
  }
`
