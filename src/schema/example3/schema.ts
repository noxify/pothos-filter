import {
  Example3Interface,
  Example3SubInterface,
} from 'src/schema/example3/interface'

import {
  builder,
  IntComparisonInput,
  Paging,
  SortDirection,
  StringComparisonInput,
} from 'src/builder'

const FilterInput = builder.inputRef('Example3FilterInput').implement({
  fields: (t) => ({
    name: t.field({ type: StringComparisonInput }),
    birthdate: t.field({ type: StringComparisonInput }),
    height: t.field({ type: IntComparisonInput }),
    and: t.field({ type: [FilterInput] }),
    or: t.field({ type: [FilterInput] }),
  }),
})

export const SortFields = builder.enumType('Example3SortFields', {
  values: ['name', 'birthday', 'height'] as const,
})

const SortingInput = builder.inputType('Example3SortOrder', {
  fields: (t) => ({
    field: t.field({
      type: SortFields,
    }),
    direction: t.field({
      type: SortDirection,
    }),
  }),
})

export const Example3 = builder.objectRef<Example3Interface>('Example3')

export const Example3Sub =
  builder.objectRef<Example3SubInterface>('Example3Sub')

Example3.implement({
  fields: (t) => ({
    name: t.exposeString('name'),
    birthdate: t.exposeString('birthdate'),
    height: t.exposeFloat('height'),
    sub: t.expose('sub', { type: Example3Sub }),
    subMany: t.expose('subMany', { type: [Example3Sub] }),
  }),
})

Example3Sub.implement({
  fields: (t) => ({
    name1: t.exposeString('name1'),
    birthdate1: t.exposeString('birthdate1'),
    height1: t.exposeFloat('height1'),
  }),
})

builder.queryFields((t) => ({
  example3: t.field({
    type: [Example3],
    args: {
      filter: t.arg({ type: FilterInput, required: false }),
      paging: t.arg({ type: Paging, required: false }),
      sorting: t.arg({ type: [SortingInput], required: false }),
    },
    resolve: () => {
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
