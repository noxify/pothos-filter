import {
  FilterInputInterface,
  Example1Interface,
  Example1SubInterface,
  SortOrderInterface,
} from 'src/schema/example1/interface'
import {
  createIntFieldComparison,
  createStringFieldComparison,
} from 'src/comparison'

import { builder, Paging, SortDirection } from 'src/builder'
import { getSelectFields } from 'src/helpers/graphql'
import { generateSqlQuery } from 'src/helpers/query-builder'

const FilterInput = builder
  .inputRef<FilterInputInterface>('Example1FilterInput')
  .implement({
    fields: (t) => ({
      //@ts-ignore
      name: t.field({
        type: createStringFieldComparison({ table: 'example1', name: 'name' }),
      }),
      //@ts-ignore
      birthdate: t.field({
        type: createStringFieldComparison({
          table: 'example1',
          name: 'birthdate',
        }),
      }),
      //@ts-ignore
      height: t.field({
        type: createIntFieldComparison({ table: 'example1', name: 'height' }),
      }),
      and: t.field({
        type: [FilterInput],
      }),
      or: t.field({
        type: [FilterInput],
      }),
    }),
  })

export const SortFields = builder.enumType('Example1SortFields', {
  values: ['name', 'birthday', 'height'] as const,
})

const SortingInput = builder
  .inputRef<SortOrderInterface>('Example1SortOrder')
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

export const Example1 = builder.objectRef<Example1Interface>('Example1')

export const Example1Sub =
  builder.objectRef<Example1SubInterface>('Example1Sub')

Example1.implement({
  fields: (t) => ({
    name: t.exposeString('name'),
    birthdate: t.exposeString('birthdate'),
    height: t.exposeFloat('height'),
    sub: t.expose('sub', { type: Example1Sub }),
    subMany: t.expose('subMany', { type: [Example1Sub] }),
  }),
})

Example1Sub.implement({
  fields: (t) => ({
    name1: t.exposeString('name1'),
    birthdate1: t.exposeString('birthdate1'),
    height1: t.exposeFloat('height1'),
  }),
})

builder.queryFields((t) => ({
  example1: t.field({
    type: [Example1],
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
        tableName: 'example1',
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
