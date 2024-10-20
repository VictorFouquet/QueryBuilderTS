import { Operators, InferValueType, InferCollectionValueType, Leaves, CollectionLeaves, AggregateOperators, InferOperator, InferCollectionOperator } from "./query.types";

// Adjusted ValueNode type
export type ValueNode<Entity, Leaf, Op extends Operators> = {
    op: Op,
    value: InferValueType<Leaf, Entity, Op> | InferCollectionValueType<Leaf, Entity, Op>
};
  
// FieldNode handling both leaves and collection leaves
export type FieldNode<Entity, Operator extends Operators> = {
    [Leaf in Leaves<Entity> as string]: Leaf extends CollectionLeaves<Entity>
        ? { aggregate: AggregateOperators; value: ValueNode<Entity, Leaf, Operator> }
        : ValueNode<Entity, Leaf, Operator>;
};
  
// AggregateNode definition
export type AggregateNode<Entity> = {
    [K in AggregateOperators as string]: FieldNode<Entity, Operators>
};

// PrimitiveLeaves definition
export type PrimitiveLeaves<Entity> = Exclude<Leaves<Entity>, CollectionLeaves<Entity>> & string; 

// WhereNode definition with non-collection and collection handling
export type WhereNode<Entity, L extends string, CL extends string> = {
    where: {
        [K in L]?: {
            op: InferOperator<K, Entity>;
            value: InferValueType<K, Entity, InferOperator<K, Entity>>;
        };
    } & {
        [K in AggregateOperators]?: {
            [P in CL]?: {
                op: InferCollectionOperator<P, Entity>;
                value: InferCollectionValueType<P, Entity, InferCollectionOperator<P, Entity>>;
            };
        };
    };
};
  