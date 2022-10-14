import { GraphQLResolveInfo } from 'graphql'

export const getSelectFields = (graphqlInfo: GraphQLResolveInfo) => {
  return graphqlInfo.fieldNodes.flatMap((fieldNode) => {
    return fieldNode.selectionSet?.selections.flatMap((selection) => {
      //@ts-ignore
      return selection.name.value
    })
  })
}
