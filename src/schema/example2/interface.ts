import { FieldComparisonInterface } from 'src/interfaces'
import { SortDirection } from 'src/builder'
import { SortFields } from 'src/schema/example2/schema'

export interface FilterInputInterface {
  name: FieldComparisonInterface<string>
  birthdate: FieldComparisonInterface<string>
  height: FieldComparisonInterface<number>
  and?: FilterInputInterface[]
  or?: FilterInputInterface[]
}

export interface SortOrderInterface {
  field: typeof SortFields
  direction: typeof SortDirection
}

export interface Example2Interface {
  name: string
  birthdate: string
  height: number
  sub: Example2SubInterface
  subMany: Example2SubInterface[]
}

export interface Example2SubInterface {
  name1: string
  birthdate1: string
  height1: number
}
