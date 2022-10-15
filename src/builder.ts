import { DateTimeResolver } from 'graphql-scalars'
import SchemaBuilder from '@pothos/core'
import {
  createStringFieldComparison,
  createIntFieldComparison,
} from 'src/comparison'

export const builder = new SchemaBuilder<{
  Scalars: {
    ID: {
      Output: number | string
      Input: string
    }
    DateTime: {
      Output: Date
      Input: Date
    }
  }
}>({
  plugins: [],
})

builder.queryType()

export const SortDirection = builder.enumType('SortDirection', {
  values: ['ASC', 'DESC'] as const,
})

export const Paging = builder.inputType('Paging', {
  fields: (t) => ({
    perPage: t.int(),
    skip: t.int(),
  }),
})

export const StringComparisonInput = createStringFieldComparison({})
export const IntComparisonInput = createIntFieldComparison({})

builder.addScalarType('DateTime', DateTimeResolver, {})
