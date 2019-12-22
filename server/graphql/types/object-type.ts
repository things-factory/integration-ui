const { GraphQLScalarType } = require('graphql')

export const GraphQLObject = new GraphQLScalarType({
  name: 'Object',
  description: 'Can be anything',
  parseValue(value) {
    return value
  },
  serialize(value) {
    return value
  },
  parseLiteral(ast) {
    return ast
  }
})
