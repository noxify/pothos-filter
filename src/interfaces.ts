export interface FieldComparisonInterface<T> {
  is?: boolean
  isNot?: boolean
  eq?: T
  neq?: T
  gt?: T
  gte?: T
  lt?: T
  lte?: T
  like?: T
  notLike?: T
  in?: T[]
  notIn?: T[]
}
