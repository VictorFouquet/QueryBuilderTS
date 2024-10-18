import {
    AggregateOperators,
    CollectionLeaves,
    InferCollectionOperator,
    InferCollectionValueType,
    InferOperator,
    InferValueType,
    Leaves,
} from "./query.types"

export type ValueNode<Leaf, Entity> = {
    op: InferOperator<Leaf, Entity> | InferCollectionOperator<Leaf, Entity>,
    value: InferValueType<Leaf, Entity, InferOperator<Leaf, Entity>> | 
           InferCollectionValueType<Leaf, Entity, InferCollectionOperator<Leaf, Entity>>
}

export type FieldNode<Leaf extends Leaves<Entity>, Entity> = {
    [K in Leaf]: ValueNode<K, Entity>
}

export type AggregateNode<Agg extends AggregateOperators, Entity> = {
    [K in Agg]: FieldNode<CollectionLeaves<Entity>, Entity>
}

export type WhereNode<Entity> = {
    where: Partial<AggregateNode<AggregateOperators, Entity> & FieldNode<Leaves<Entity>, Entity>>
}