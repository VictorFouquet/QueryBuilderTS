import { Operators, InferValueType, InferCollectionValueType, Leaves, CollectionLeaves, AggregateOperators, InferOperator, InferCollectionOperator } from "./query.types";

// Adjusted ValueNode type
export type ValueNode<Entity, Leaf, Op extends Operators> = {
    op: Op,
    value: InferValueType<Leaf, Entity, Op> | InferCollectionValueType<Leaf, Entity, Op>
};
  
// FieldNode handling both leaves and collection leaves
export type FieldNode<Entity, Operator extends Operators> = {
    [Leaf in Leaves<Entity>]: Leaf extends CollectionLeaves<Entity>
        ? { aggregate: AggregateOperators; value: ValueNode<Entity, Leaf, Operator> }
        : ValueNode<Entity, Leaf, Operator>;
};
  
// AggregateNode definition
export type AggregateNode<Entity> = {
    [K in AggregateOperators]: FieldNode<Entity, Operators>
};
  
// WhereNode definition with non-collection and collection handling
export type WhereNode<Entity> = {
    where: {
        [K in Exclude<Leaves<Entity>, CollectionLeaves<Entity>>]?: {
            op: InferOperator<K, Entity>;
            value: InferValueType<K, Entity, InferOperator<K, Entity>>;
        };
    } & {
        [K in AggregateOperators]?: {
            [P in CollectionLeaves<Entity>]?: {
                op: InferCollectionOperator<P, Entity>;
                value: InferCollectionValueType<P, Entity, InferCollectionOperator<P, Entity>>;
            };
        };
    };
};
  