import 'src/schema/example1/schema.ts'
import 'src/schema/example2/schema.ts'

import { builder } from 'src/builder'
export const schema = builder.toSchema()
