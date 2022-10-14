import { FieldComparisonInterface } from 'src/interfaces'
import { SortDirection } from 'src/builder'
import { SortFields } from 'src/schema/example1/schema'

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

export interface Example1Interface {
  name: string
  birthdate: string
  height: number
  sub: Example1SubInterface
  subMany: Example1SubInterface[]
}

export interface Example1SubInterface {
  name1: string
  birthdate1: string
  height1: number
}
