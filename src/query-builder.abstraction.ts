import { WhereNode } from "./ast.types";
import { AGGREGATE_OPS } from "./query.operators";
import {
    AggregateOperators,
    CollectionLeaves,
    InferCollectionOperator,
    InferCollectionValueType,
    InferOperator,
    InferValueType,
    Leaves,
} from "./query.types";

export abstract class Query<Entity, PrimitiveLeaves extends string, ArrayLeaves extends string> {
    whereClause: WhereNode<Entity, PrimitiveLeaves, ArrayLeaves> = { where: {} };

    where<
        Key extends Leaves<Entity>,
        Operator extends InferOperator<Key, Entity>,
        Value extends InferValueType<Key, Entity, Operator>
    > (
        leaf:  Key,
        op:    Operator,
        value: Value
    ): this {
        (this.whereClause.where as any)[leaf] = {
            op,
            value
        };

        return this
    }

    whereCollection<
        Key extends CollectionLeaves<Entity>,
        Operator extends InferCollectionOperator<Key, Entity>,
        Value extends InferCollectionValueType<Key, Entity, Operator>
    > (
        action: AggregateOperators,
        leaf:   Key,
        op:     Operator,
        value:  Value,
    ): this {
        for (let _action of AGGREGATE_OPS) {
            if (
                (this.whereClause.where as any)[_action] !== undefined &&
                (this.whereClause.where as any)[_action][leaf] !== undefined
            ) {
                delete (this.whereClause.where as any)[_action][leaf];
                if (Object.keys((this.whereClause.where as any)[_action]).length === 0) {
                    delete (this.whereClause.where as any)[_action];
                }
            }
        }

        if (!this.whereClause.where[action]) {
            (this.whereClause.where as any)[action] = {};
        }

        (this.whereClause.where as any)[action][leaf] = {
            op,
            value
        };

        return this;
    }
}
