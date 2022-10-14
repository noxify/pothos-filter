import {
  FilterInputInterface,
  Example2Interface,
  Example2SubInterface,
  SortOrderInterface,
} from 'src/schema/example2/interface'
import {
  createIntFieldComparison,
  createStringFieldComparison,
} from 'src/comparison'

import { builder, Paging, SortDirection } from 'src/builder'
import { getSelectFields } from 'src/helpers/graphql'
import { generateSqlQuery } from 'src/helpers/query-builder'

const FilterInput = builder
  .inputRef<FilterInputInterface>('Example2FilterInput')
  .implement({
    fields: (t) => ({
      //@ts-ignore
      name: t.field({
        type: createStringFieldComparison({ table: 'example2', name: 'name' }),
      }),
      //@ts-ignore
      birthdate: t.field({
        type: createStringFieldComparison({
          table: 'example2',
          name: 'birthdate',
        }),
      }),
      //@ts-ignore
      height: t.field({
        type: createIntFieldComparison({ table: 'example2', name: 'height' }),
      }),
      and: t.field({
        type: [FilterInput],
      }),
      or: t.field({
        type: [FilterInput],
      }),
    }),
  })

export const SortFields = builder.enumType('Example2SortFields', {
  values: ['name', 'birthday', 'height'] as const,
})

const SortingInput = builder
  .inputRef<SortOrderInterface>('Example2SortOrder')
  .implement({
    fields: (t) => ({
      //@ts-ignore
      field: t.field({
        type: SortFields,
      }),
      //@ts-ignore
      direction: t.field({
        type: SortDirection,
      }),
    }),
  })

export const Example2 = builder.objectRef<Example2Interface>('Example2')

export const Example2Sub =
  builder.objectRef<Example2SubInterface>('Example2Sub')

Example2.implement({
  fields: (t) => ({
    name: t.exposeString('name'),
    birthdate: t.exposeString('birthdate'),
    height: t.exposeFloat('height'),
    sub: t.expose('sub', { type: Example2Sub }),
    subMany: t.expose('subMany', { type: [Example2Sub] }),
  }),
})

Example2Sub.implement({
  fields: (t) => ({
    name1: t.exposeString('name1'),
    birthdate1: t.exposeString('birthdate1'),
    height1: t.exposeFloat('height1'),
  }),
})

builder.queryFields((t) => ({
  example2: t.field({
    type: [Example2],
    args: {
      filter: t.arg({ type: FilterInput, required: false }),
      paging: t.arg({ type: Paging, required: false }),
      sorting: t.arg({ type: [SortingInput], required: false }),
    },
    resolve: (parent, args, context, info) => {
      const selectFields = getSelectFields(info)
      const query = generateSqlQuery({
        select: selectFields,
        schema: 'example_schema',
        tableName: 'example2',
        filter: args.filter,
        paging: args.paging,
        sorting: args.sorting as unknown as {
          field: string
          direction: string
        }[],
      })

      console.log({ selectFields, query })

      return [
        {
          name: 'test',
          birthdate: '2022-10-04',
          height: 7.5,
          sub: {
            name1: 'test1',
            birthdate1: '2022-10-04',
            height1: 7.5,
          },
          subMany: [
            {
              name1: 'test2',
              birthdate1: '2022-10-04',
              height1: 7.5,
            },
            {
              name1: 'test3',
              birthdate1: '2022-10-04',
              height1: 7.5,
            },
          ],
        },
      ]
    },
  }),
}))
