import { builder } from './builder'
import { InputFieldRef } from '@pothos/core'

type FieldComparisonArgs = {
  name: string
  table: string
}

type AllowedOperators =
  | 'is'
  | 'isNot'
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'notLike'
  | 'in'
  | 'notIn'

const generateComparison = ({
  name,
  table,
  type,
  allowedOperators,
}: FieldComparisonArgs & {
  type: any
  allowedOperators?: AllowedOperators[]
}) => {
  return builder.inputType(`${table}_${name}_${type}FieldComparison`, {
    fields: (t) => {
      const operators: { [key: string]: InputFieldRef<any, 'InputObject'> } = {
        is: t.boolean({}),
        isNot: t.boolean({}),
        eq: t.field({ type }),
        neq: t.field({ type }),
        gt: t.field({ type }),
        gte: t.field({ type }),
        lt: t.field({ type }),
        lte: t.field({ type }),
        like: t.field({ type }),
        notLike: t.field({ type }),
        in: t.field({ type: [type] }),
        notIn: t.field({ type: [type] }),
      }

      const operatorKeys = allowedOperators || Object.keys(operators)

      const availableOperators: {
        [key: string]: InputFieldRef<any, 'InputObject'>
      } = {}

      for (const operatorKey of operatorKeys) {
        availableOperators[operatorKey] = operators[operatorKey]
      }

      return availableOperators
    },
  })
}

export const createStringFieldComparison = (args: FieldComparisonArgs) => {
  return generateComparison({
    ...args,
    type: 'String',
    allowedOperators: ['eq', 'neq', 'like', 'notLike', 'in', 'notIn'],
  })
}

export const createIntFieldComparison = (args: FieldComparisonArgs) => {
  return generateComparison({
    ...args,
    type: 'Int',
    allowedOperators: ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in', 'notIn'],
  })
}

export const createFloatFieldComparison = (args: FieldComparisonArgs) => {
  return generateComparison({
    ...args,
    type: 'Float',
    allowedOperators: ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in', 'notIn'],
  })
}

export const createIDFieldComparison = (args: FieldComparisonArgs) => {
  return generateComparison({ ...args, type: 'ID' })
}

export const createBooleanFieldComparison = (args: FieldComparisonArgs) => {
  return generateComparison({
    ...args,
    type: 'Boolean',
    allowedOperators: ['is', 'isNot'],
  })
}

export const createDateFieldComparison = (args: FieldComparisonArgs) => {
  return generateComparison({
    ...args,
    type: 'Date',
    allowedOperators: ['eq', 'neq', 'lt', 'lte', 'gt', 'gte'],
  })
}

export const createDateTimeFieldComparison = (args: FieldComparisonArgs) => {
  return generateComparison({
    ...args,
    type: 'DateTime',
    allowedOperators: ['eq', 'neq', 'lt', 'lte', 'gt', 'gte'],
  })
}
