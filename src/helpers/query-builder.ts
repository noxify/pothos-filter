import { InputShapeFromFields, InputFieldRef } from '@pothos/core'
import { queryConverter, Where } from 'src/helpers/query-converter'
import { DataSource } from 'typeorm'

export const generateSqlQuery = ({
  select,
  filter,
  paging,
  sorting,
  tableName,
}: {
  select: string[]
  filter?: any
  paging?: InputShapeFromFields<{
    perPage: InputFieldRef<number | null | undefined, 'InputObject'>
    skip: InputFieldRef<number | null | undefined, 'InputObject'>
  }> | null
  sorting?: { field: string; direction: string }[]
  schema: string
  tableName: string
}) => {
  const dataSource = new DataSource({ type: 'sqljs' })

  const selectBuilder = dataSource
    .createQueryBuilder()
    .addFrom(`${tableName}`, tableName)

  select.forEach((fieldName: string) => {
    selectBuilder.addSelect(`"${fieldName}"`)
  })

  const sqlQuery = queryConverter(selectBuilder, filter as Where)

  const orderQuery =
    sorting && sorting.length > 0
      ? `ORDER BY ${sorting
          .map((ele) => `${ele.field} ${ele.direction}`)
          .join(', ')}`
      : ''

  // https://trino.io/blog/2020/02/03/beyond-limit-presto-meets-offset-and-ties.html
  let pagingSql = ''
  if (!paging?.skip || paging.skip <= 0) {
    pagingSql = `LIMIT ${paging?.perPage || 100}`
  } else {
    pagingSql = `OFFSET ${paging?.skip || 0} LIMIT ${paging?.perPage || 100}`
  }

  return `${sqlQuery.getSql()} ${orderQuery} ${pagingSql}`
}
