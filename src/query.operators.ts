import { AggregateOperators, BooleanOperators, LiteralOperators, NumericalOperators, NumericalRangeOperators } from "./query.types";

export const AGGREGATE_OPS: AggregateOperators[]      = ['some', 'all', 'none'];
export const BOOLEAN_OPS:   BooleanOperators[]        = ['is', 'not'];
export const LITERAL_OPS:   LiteralOperators[]        = ['eq', 'contains', 'startswith', 'endswith'];
export const NUM_OPS:       NumericalOperators[]      = ['eq', 'lte', 'gte', 'lt', 'gt', 'neq'];
export const NUM_RANGE_OPS: NumericalRangeOperators[] = ['gt_lt', 'gt_lte', 'gte_lt', 'gte_lte'];
