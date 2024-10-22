// Utils types to concatenate strings and update objects
type ParentChildKey<P, C> = `${P & string}.${C & string}`;
type Path<Prefix extends string, Key, Sep extends string = ''> = `${Prefix}${Key & string}${Sep}`;
type Visited<T, K> = { [key in ParentChildKey<T, K>]: true } & { [key in ParentChildKey<K, T>]: true } 
type Updated<V, T, K> = V & Visited<T, K>;

// Recursive type to extract keys where the value is a primitive or object
type LeafKeys<T, MatchType, Prefix extends string = '', VisitedKeys = {}> = {
    [K in keyof T]: T[K] extends MatchType
        ? Path<Prefix, K> // If value matches, include key
        : T[K] extends object
        ? ParentChildKey<T, K> extends keyof VisitedKeys // Check if we have visited this key
            ? never // Skip already visited types
            : LeafKeys<T[K], MatchType, Path<Prefix, K, '.'>, Updated<VisitedKeys, T, K>> // Recurse with tracking
        : never; // Skip non-matching types
}[keyof T];

  
// Recursive type to extract keys where the value is a primitive or object and contained in a collection
type ArrayLeafKeys<T, MatchType, Prefix extends string = '', HasArray extends boolean = false, VisitedKeys = {}> = {
    [K in keyof T]: T[K] extends Array<infer U> // If the current property is an array
        ? K extends keyof VisitedKeys // Check if we have visited this key already
            ? never // Skip already visited keys
            : ArrayLeafKeys<U, MatchType, Path<Prefix, K, '.'>, true, Updated<VisitedKeys, T, K>> // Recurse into the array's element type
        : T[K] extends MatchType
        ? HasArray extends true
            ? Path<Prefix, K> // Store key if within an array
            : never // Skip primitives that are not inside arrays
        : T[K] extends object
        ? ParentChildKey<T, K> extends keyof VisitedKeys // Check if we have visited this key already
            ? never // Skip already visited keys
            : ArrayLeafKeys<T[K], MatchType, Path<Prefix, K, '.'>, HasArray, Updated<VisitedKeys, T, K>> // Recurse into the nested object
        : never; // Skip non-matching types
}[keyof T];



export type AggregateOperators      = 'some' | 'all' | 'none';
export type BooleanOperators        = 'is' | 'not';
export type LiteralOperators        = 'eq' | 'contains' | 'startswith' | 'endswith';
export type LiteralLikeOperators    = 'like';
export type NumericalOperators      = 'eq' | 'lte' | 'gte' | 'lt' | 'gt' | 'neq';
export type NumericalRangeOperators = 'gt_lt' | 'gt_lte' | 'gte_lt' | 'gte_lte';
export type Operators = AggregateOperators | BooleanOperators | LiteralOperators | NumericalOperators | NumericalRangeOperators;

export type LikeValue = `${string}%${string}` | `${string}_${string}`; 
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
    ? LiteralOperators | LiteralLikeOperators
    : BooleanOperators;

export type InferCollectionOperator<Leaf, Entity> =
    Leaf extends CollectionNumericalLeaves<Entity> | CollectionDateLeaves<Entity>
    ? NumericalOperators | NumericalRangeOperators
    : Leaf extends CollectionLiteralLeaves<Entity>
    ? LiteralOperators | LiteralLikeOperators
    : BooleanOperators;

export type InferValueType<Leaf, Entity, Operator> =
    Leaf extends NumericalLeaves<Entity>
    ? Operator extends NumericalRangeOperators ? [number, number] : number
    : Leaf extends DateLeaves<Entity>
    ? Operator extends NumericalRangeOperators ? [Date, Date] : Date
    : Leaf extends LiteralLeaves<Entity>
    ? Operator extends LiteralLikeOperators ? LikeValue : string
    : boolean;


export type InferCollectionValueType<Leaf, Entity, Operator> =
    Leaf extends CollectionNumericalLeaves<Entity> 
    ? Operator extends NumericalRangeOperators ? [number, number] : number
    : Leaf extends CollectionDateLeaves<Entity>
    ? Operator extends NumericalRangeOperators ? [Date, Date] : Date
    : Leaf extends CollectionLiteralLeaves<Entity>
    ? Operator extends LiteralLikeOperators ? LikeValue : string
    : boolean;
