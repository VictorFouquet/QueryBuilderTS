import { WhereNode, FieldNode } from "./ast.types";
import {
    AggregateOperators,
    CollectionLeaves,
    InferCollectionOperator,
    InferCollectionValueType,
    InferOperator,
    InferValueType,
    Leaves,
} from "./query.types";

export abstract class Query<Entity> {
    whereClause: WhereNode<Entity> = { where: {} };

    where<Leaf extends Leaves<Entity>> (
        leaf:  Leaf,
        op:    InferOperator<Leaf, Entity>,
        value: InferValueType<Leaf, Entity>
    ): this {
        (this.whereClause.where as any)[leaf] = {
            op,
            value
        };

        return this
    }

    whereCollection<Leaf extends CollectionLeaves<Entity>> (
        action: AggregateOperators,
        leaf:   Leaf,
        op:     InferCollectionOperator<Leaf, Entity>,
        value:  InferCollectionValueType<Leaf, Entity>,
    ): this {
        const fieldNode = this.buildFieldNode(leaf, op, value);

        if (!this.whereClause.where[action]) {
            (this.whereClause.where as any)[action] = {};
        }

        (this.whereClause.where as any)[action][leaf] = fieldNode[leaf];

        return this
    }

    private buildFieldNode<Leaf extends Leaves<Entity> | CollectionLeaves<Entity>>(
        leaf:   Leaf,
        op:     InferOperator<Leaf, Entity>  | InferCollectionOperator<Leaf, Entity>,
        value:  InferValueType<Leaf, Entity> | InferCollectionValueType<Leaf, Entity>,
    ): FieldNode<Leaf, Entity> {
        return {
            [leaf]: {
                op,
                value
            }
        } as FieldNode<Leaf, Entity>;;
    }
}
