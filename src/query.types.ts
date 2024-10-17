// Recursive type to extract keys where the value is a primitive or object
export type LeafKeys<T, MatchType, Prefix extends string = ''> = {
    [K in keyof T]: T[K] extends MatchType
        ? `${Prefix}${K & string}` // If value is primitive, store the key as is
        : T[K] extends object // If value is an object, recurse into the object
        ? LeafKeys<T[K], MatchType, `${Prefix}${K & string}.`>
        : never;
}[keyof T];
  
// Recursive type to extract keys where the value is a primitive or object and contained in a collection
export type ArrayLeafKeys<T, MatchType, Prefix extends string = '', HasArray extends boolean = false> = {
    [K in keyof T]: T[K] extends (infer U)[] // If the current property is an array
        ? ArrayLeafKeys<U, MatchType, `${Prefix}${K & string}.`, true> // Recurse into the array's element type (U) and set HasArray to true
        : T[K] extends MatchType
        ? HasArray extends true
            ? `${Prefix}${K & string}` // Stores the key, as the value is a primitive with an array in its parents
            : never
        : T[K] extends object // Recurse into nested object
        ? ArrayLeafKeys<T[K], MatchType, `${Prefix}${K & string}.`, HasArray>
        : never;
}[keyof T];

  
export type NumericalOperators =   'eq' | 'lte' | 'gte' | 'lt' | 'lte' | 'neq';
export type LiteralOperators =     'eq' | 'contains' | 'startswith' | 'endswith';
export type BooleanOperators =     'is' | 'not';
export type AggregateOperators = 'some' | 'all' | 'none';

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

export type InferOperator<Leaf, Entity> = Leaf extends NumericalLeaves<Entity> | DateLeaves<Entity>
    ? NumericalOperators
    : Leaf extends LiteralLeaves<Entity>
    ? LiteralOperators
    : BooleanOperators;

export type InferCollectionOperator<Leaf, Entity> = Leaf extends CollectionNumericalLeaves<Entity> | CollectionDateLeaves<Entity>
    ? NumericalOperators
    : Leaf extends CollectionLiteralLeaves<Entity>
    ? LiteralOperators
    : BooleanOperators;

export type InferValueType<Leaf, Entity> = Leaf extends NumericalLeaves<Entity> ? number
    : Leaf extends DateLeaves<Entity>    ? Date
    : Leaf extends LiteralLeaves<Entity> ? string : boolean;

export type InferCollectionValueType<Leaf, Entity> = Leaf extends CollectionNumericalLeaves<Entity> ? number
    : Leaf extends CollectionDateLeaves<Entity>    ? Date
    : Leaf extends CollectionLiteralLeaves<Entity> ? string : boolean;