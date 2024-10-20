import { InferValueType, InferCollectionValueType, AggregateOperators, InferOperator, InferCollectionOperator } from "./query.types";


export type PrimitiveNode<Entity, Leaf extends string> = {
    [K in Leaf]?: {
        op: InferOperator<K, Entity>;
        value: InferValueType<K, Entity, InferOperator<K, Entity>>;
    };
}

export type AggregateNode<Entity, Leaf extends string> = {
    [K in AggregateOperators]?: {
        op: InferCollectionOperator<Leaf, Entity>;
        value: InferCollectionValueType<Leaf, Entity, InferCollectionOperator<Leaf, Entity>>;
    };
}

export type WhereNode<Entity, L extends string, CL extends string> = {
    where: PrimitiveNode<Entity, L> & AggregateNode<Entity, CL>;
};