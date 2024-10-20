import { Query } from "../../src/query-builder.abstraction";
import { PrimitiveLeaves, CollectionLeaves } from "../../src/query.types";

test('Query should support filtering on numerical values with different numerical operators', () => {
    interface Queryable { id: number };
    class Q extends Query<Queryable, PrimitiveLeaves<Queryable>, CollectionLeaves<Queryable>> {};

    expect(new Q().where('id', 'eq', 1).whereClause)
    .toStrictEqual({ where: { id: { op: "eq", value: 1 } }});

    expect(new Q().where('id', 'gt', 1).whereClause)
    .toStrictEqual({ where: { id: { op: "gt", value: 1 } }});

    expect(new Q().where('id', 'lt', 1).whereClause)
    .toStrictEqual({ where: { id: { op: "lt", value: 1 } }});

    expect(new Q().where('id', 'gte', 1).whereClause)
    .toStrictEqual({ where: { id: { op: "gte", value: 1 } }});

    expect(new Q().where('id', 'lte', 1).whereClause)
    .toStrictEqual({ where: { id: { op: "lte", value: 1 } }});

    expect(new Q().where('id', 'neq', 1).whereClause)
    .toStrictEqual({ where: { id: { op: "neq", value: 1 } }});
})

test('Query should support filtering on numerical values with different range operators', () => {
    interface Queryable { id: number };
    class Q extends Query<Queryable, PrimitiveLeaves<Queryable>, CollectionLeaves<Queryable>> {};

    expect(new Q().where('id', 'eq', 1).whereClause)

    expect(new Q().where('id', 'gt_lt', [0, 2]).whereClause)
    .toStrictEqual({ where: { id: { op: "gt_lt", value: [0, 2] } }});

    expect(new Q().where('id', 'gt_lte', [0, 1]).whereClause)
    .toStrictEqual({ where: { id: { op: "gt_lte", value: [0, 1] } }});

    expect(new Q().where('id', 'gte_lt', [1, 2]).whereClause)
    .toStrictEqual({ where: { id: { op: "gte_lt", value: [1, 2] } }});

    expect(new Q().where('id', 'gte_lte', [1, 1]).whereClause)
    .toStrictEqual({ where: { id: { op: "gte_lte", value: [1, 1] } }});
})

test('Query should support filtering on date values with different numerical operators', () => {
    interface Queryable { due: Date };
    class Q extends Query<Queryable, PrimitiveLeaves<Queryable>, CollectionLeaves<Queryable>> {};

    expect(new Q().where('due', 'eq', new Date('01-01-2024')).whereClause)
    .toStrictEqual({ where: { due: { op: "eq", value: new Date('01-01-2024') } }});

    expect(new Q().where('due', 'gt', new Date('01-01-2024')).whereClause)
    .toStrictEqual({ where: { due: { op: "gt", value: new Date('01-01-2024') } }});

    expect(new Q().where('due', 'lt', new Date('01-01-2024')).whereClause)
    .toStrictEqual({ where: { due: { op: "lt", value: new Date('01-01-2024') } }});

    expect(new Q().where('due', 'gte', new Date('01-01-2024')).whereClause)
    .toStrictEqual({ where: { due: { op: "gte", value: new Date('01-01-2024') } }});

    expect(new Q().where('due', 'lte', new Date('01-01-2024')).whereClause)
    .toStrictEqual({ where: { due: { op: "lte", value: new Date('01-01-2024') } }});

    expect(new Q().where('due', 'neq', new Date('01-01-2024')).whereClause)
    .toStrictEqual({ where: { due: { op: "neq", value: new Date('01-01-2024') } }});
})

test('Query should support filtering on date values with different range operators', () => {
    interface Queryable { due: Date };
    class Q extends Query<Queryable, PrimitiveLeaves<Queryable>, CollectionLeaves<Queryable>> {};

    expect(new Q().where('due', 'gt_lt', [new Date('01-01-2024'), new Date('01-31-2024')]).whereClause)
    .toStrictEqual({ where: { due: { op: "gt_lt", value: [new Date('01-01-2024'), new Date('01-31-2024')] } }});

    expect(new Q().where('due', 'gt_lte', [new Date('01-01-2024'), new Date('01-31-2024')]).whereClause)
    .toStrictEqual({ where: { due: { op: "gt_lte", value: [new Date('01-01-2024'), new Date('01-31-2024')] } }});

    expect(new Q().where('due', 'gte_lt', [new Date('01-01-2024'), new Date('01-31-2024')]).whereClause)
    .toStrictEqual({ where: { due: { op: "gte_lt", value: [new Date('01-01-2024'), new Date('01-31-2024')] } }});

    expect(new Q().where('due', 'gte_lte', [new Date('01-01-2024'), new Date('01-31-2024')]).whereClause)
    .toStrictEqual({ where: { due: { op: "gte_lte", value: [new Date('01-01-2024'), new Date('01-31-2024')] } }});
})

test('Query should support filtering on literal values with different literal operators', () => {
    interface Queryable { name: string };
    class Q extends Query<Queryable, PrimitiveLeaves<Queryable>, CollectionLeaves<Queryable>> {};

    expect(new Q().where('name', 'eq', 'abc').whereClause)
    .toStrictEqual({ where: { name: { op: 'eq', value: 'abc' } }});

    expect(new Q().where('name', 'contains', 'abc').whereClause)
    .toStrictEqual({ where: { name: { op: 'contains', value: 'abc' } }});

    expect(new Q().where('name', 'startswith', 'abc').whereClause)
    .toStrictEqual({ where: { name: { op: 'startswith', value: 'abc' } }});

    expect(new Q().where('name', 'endswith', 'abc').whereClause)
    .toStrictEqual({ where: { name: { op: 'endswith', value: 'abc' } }});
})

test('Query should support filtering on boolean values with different boolean operators', () => {
    interface Queryable { closed: boolean };
    class Q extends Query<Queryable, PrimitiveLeaves<Queryable>, CollectionLeaves<Queryable>> {};

    expect(new Q().where('closed', 'is', true).whereClause)
    .toStrictEqual({ where: { closed: { op: 'is', value: true } }});

    expect(new Q().where('closed', 'not', true).whereClause)
    .toStrictEqual({ where: { closed: { op: 'not', value: true } }});
})
