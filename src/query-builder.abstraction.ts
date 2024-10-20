import { WhereNode } from "./ast.types";
import { AGGREGATE_OPS } from "./query.operators";
import {
    AggregateOperators,
    CollectionLeaves,
    InferCollectionOperator,
    InferCollectionValueType,
    InferOperator,
    InferValueType,
} from "./query.types";

export abstract class Query<Entity, Leaves extends string, ArrayLeaves extends string> {
    whereClause: WhereNode<Entity, Leaves, ArrayLeaves> = { where: {} };

    where<
        Key extends Leaves,
        Operator extends InferOperator<Key, Entity>,
        Value extends InferValueType<Key, Entity, Operator>
    > (
        leaf:  Key,
        op:    Operator,
        value: Value
    ): this {
        const valueNode = { [leaf]: { op, value } };
        this.whereClause.where = { ...this.whereClause.where, ...valueNode };

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
                this.whereClause.where[_action] !== undefined &&
                this.whereClause.where[_action][leaf] !== undefined
            ) {
                delete this.whereClause.where[_action][leaf];
                if (Object.keys(this.whereClause.where[_action]).length === 0) {
                    delete this.whereClause.where[_action];
                }
            }
        }

        const valueNode = {
            [leaf]: {
                op, value
            }
        };
        const actionNode = {
            [action]: {
                ...this.whereClause.where[action],
                ...valueNode
            }
        };
        this.whereClause.where = {
            ...this.whereClause.where,
            ...actionNode
        };

        return this;
    }

    orWhere(query: Query<Entity, Leaves, ArrayLeaves>): this {
        this.whereClause.where = {
            ...this.whereClause.where,
            OR: [
                { where: {...this.whereClause.where } }, // Keep the existing whereClause
                query.whereClause // Add the new whereClause from the other query
            ]
        };

        for (let key of Object.keys(this.whereClause.where)) {
            if (key === "OR")
                continue;
            delete (this.whereClause.where as any)[key];
        }

        return this;
    }
}
