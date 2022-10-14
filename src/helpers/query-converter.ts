// https://stackoverflow.com/a/63902324/2769836
// https://stackoverflow.com/a/54200659/2769836
import {
  Brackets,
  ObjectLiteral,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm'

export enum Operator {
  AND = 'and',
  OR = 'or',
}

// interfaces
type FieldOptions = {
  eq?: string
  neq?: string
  in?: string
  notIn?: string
  lt?: string
  lte?: string
  gt?: string
  gte?: string
  like?: string
  notLike?: string
}

export type Field = {
  [key: string]: FieldOptions
}

export type Where = {
  [K in Operator]?: (Where | Field)[]
}

const handleArgs = (
  query: WhereExpressionBuilder,
  where: Where,
  andOr: 'andWhere' | 'orWhere',
) => {
  const whereArgs = Object.entries(where)

  whereArgs.map((whereArg) => {
    const [fieldName, filters] = whereArg
    const ops = Object.entries(filters)

    ops.map((parameters) => {
      const [operation, value] = parameters
      let fieldValue: any

      const valueType = typeof value

      if (valueType == 'string') {
        fieldValue = `'${value}'`
      } else {
        fieldValue = value
      }

      switch (operation) {
        case 'eq': {
          query[andOr](`${fieldName} = ${fieldValue}`)

          break
        }
        case 'neq': {
          query[andOr](`${fieldName} != ${fieldValue}`)

          break
        }
        case 'in': {
          query[andOr](`${fieldName} IN (${value})`)
          break
        }
        case 'notIn': {
          query[andOr](`${fieldName} NOT IN (${value})`)
          break
        }
        case 'lt': {
          query[andOr](`${fieldName} < ${fieldValue}`)

          break
        }
        case 'lte': {
          query[andOr](`${fieldName} <= ${fieldValue}`)

          break
        }
        case 'gt': {
          query[andOr](`${fieldName} > ${fieldValue}`)

          break
        }
        case 'gte': {
          query[andOr](`${fieldName} >= ${fieldValue}`)

          break
        }
        case 'like': {
          query[andOr](`${fieldName} LIKE '%${value}%'`)
          break
        }
        case 'notLike': {
          query[andOr](`${fieldName} NOT LIKE '%${value}%'`)
          break
        }

        default: {
          break
        }
      }
    })
  })

  return query
}

// functions
export const queryConverter = <T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  where: Where,
) => {
  if (!where) {
    return query
  } else {
    return traverseTree(query, where) as SelectQueryBuilder<T>
  }
}

const traverseTree = (
  query: WhereExpressionBuilder,
  where: Where,
  upperOperator = Operator.AND,
) => {
  Object.keys(where).forEach((key) => {
    if (key === Operator.OR) {
      query.orWhere(buildNewBrackets(where, Operator.OR))
    } else if (key === Operator.AND) {
      query.andWhere(buildNewBrackets(where, Operator.AND))
    } else {
      // Field
      query = handleArgs(
        query,
        where as Field,
        upperOperator === Operator.AND ? 'andWhere' : 'orWhere',
      )
    }
  })

  return query
}

const buildNewBrackets = (where: Where, operator: Operator) => {
  return new Brackets((qb: any) =>
    (where[operator] || []).map((queryArray) => {
      return traverseTree(qb, queryArray, operator)
    }),
  )
}
