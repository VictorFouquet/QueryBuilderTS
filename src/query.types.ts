// Recursive type to extract keys where the value is a primitive or object
type LeafKeys<T, MatchType, Prefix extends string = '', VisitedKeys = {}, VisitedValues = never> = {
    [K in keyof T]: T[K] extends MatchType
        ? `${Prefix}${K & string}` // If value matches, include key
        : T[K] extends object
        ? K extends keyof VisitedKeys // Check if we have visited this key
            ? never // Skip already visited keys
            : [T[K]] extends [VisitedValues] // Check if the type has already been visited
            ? never // Skip already visited types
            : LeafKeys<T[K], MatchType, `${Prefix}${K & string}.`, VisitedKeys & { [key in K]: true }, VisitedValues | T[K]> // Recurse with tracking
        : never; // Skip non-matching types
}[keyof T];

  
// Recursive type to extract keys where the value is a primitive or object and contained in a collection
type ArrayLeafKeys<T, MatchType, Prefix extends string = '', HasArray extends boolean = false, VisitedKeys = {}, VisitedValues = never> = {
    [K in keyof T]: T[K] extends (infer U)[] // If the current property is an array
        ? K extends keyof VisitedKeys // Check if we have visited this key already
            ? never // Skip already visited keys
            : [U] extends [VisitedValues] // Check if the array's element type has already been visited
            ? never // Avoid recursion if the type has been visited
            : ArrayLeafKeys<U, MatchType, `${Prefix}${K & string}.`, true, VisitedKeys & { [key in K]: true }, VisitedValues | U> // Recurse into the array's element type
        : T[K] extends MatchType
        ? HasArray extends true
            ? `${Prefix}${K & string}` // Store key if within an array
            : never // Skip primitives that are not inside arrays
        : T[K] extends object
        ? K extends keyof VisitedKeys // Check if we have visited this key already
            ? never // Skip already visited keys
            : [T[K]] extends [VisitedValues] // Check if we've already visited this type
            ? never // Avoid infinite recursion for circular types
            : ArrayLeafKeys<T[K], MatchType, `${Prefix}${K & string}.`, HasArray, VisitedKeys & { [key in K]: true }, VisitedValues | T[K]> // Recurse into the nested object
        : never; // Skip non-matching types
}[keyof T];



export type AggregateOperators      = 'some' | 'all' | 'none';
export type BooleanOperators        = 'is' | 'not';
export type LiteralOperators        = 'eq' | 'contains' | 'startswith' | 'endswith';
export type NumericalOperators      = 'eq' | 'lte' | 'gte' | 'lt' | 'gt' | 'neq';
export type NumericalRangeOperators = 'gt_lt' | 'gt_lte' | 'gte_lt' | 'gte_lte';
export type Operators = AggregateOperators | BooleanOperators | LiteralOperators | NumericalOperators | NumericalRangeOperators;

export type NumericalLeaves<T> = LeafKeys<T, number>;
export type CollectionNumericalLeaves<T> = ArrayLeafKeys<T, number>

export type LiteralLeaves<T> = LeafKeys<T, string>;
export type CollectionLiteralLeaves<T> = ArrayLeafKeys<T, string>

export type DateLeaves<T> = LeafKeys<T, Date>
export type CollectionDateLeaves<T> = ArrayLeafKeys<T, Date>

export type BooleanLeaves<T> = LeafKeys<T, boolean>;
export type CollectionBooleanLeaves<T> = ArrayLeafKeys<T, boolean>

export type Leaves<T> = NumericalLeaves<T> | LiteralLeaves<T> | DateLeaves<T> | BooleanLeaves<T>;
export type CollectionLeaves<T> = CollectionNumericalLeaves<T> | CollectionLiteralLeaves<T> | CollectionDateLeaves<T> | CollectionBooleanLeaves<T>;
export type PrimitiveLeaves<Entity> = Exclude<Leaves<Entity>, CollectionLeaves<Entity>> & string;

export type InferOperator<Leaf, Entity> =
    Leaf extends NumericalLeaves<Entity> | DateLeaves<Entity>
    ? NumericalOperators | NumericalRangeOperators
    : Leaf extends LiteralLeaves<Entity>
    ? LiteralOperators
    : BooleanOperators;

export type InferCollectionOperator<Leaf, Entity> =
    Leaf extends CollectionNumericalLeaves<Entity> | CollectionDateLeaves<Entity>
    ? NumericalOperators | NumericalRangeOperators
    : Leaf extends CollectionLiteralLeaves<Entity>
    ? LiteralOperators
    : BooleanOperators;

export type InferValueType<Leaf, Entity, Operator> =
    Leaf extends NumericalLeaves<Entity>
    ? Operator extends NumericalRangeOperators ? [number, number] : number
    : Leaf extends DateLeaves<Entity>
    ? Operator extends NumericalRangeOperators ? [Date, Date] : Date
    : Leaf extends LiteralLeaves<Entity> ? string : boolean;


export type InferCollectionValueType<Leaf, Entity, Operator> =
    Leaf extends CollectionNumericalLeaves<Entity> 
    ? Operator extends NumericalRangeOperators ? [number, number] : number
    : Leaf extends CollectionDateLeaves<Entity>
    ? Operator extends NumericalRangeOperators ? [Date, Date] : Date
    : Leaf extends CollectionLiteralLeaves<Entity> ? string : boolean;
