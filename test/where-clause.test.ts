import { PrimitiveLeaves } from "../src/ast.types";
import { Query } from "../src/query-builder.abstraction"
import { CollectionLeaves } from "../src/query.types";

test('Query should support filtering on numerical values with different operators', () => {
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

test('Query should support filtering on date values with different operators', () => {
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

test('Query should support filtering on literal values with different operators', () => {
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

test('Query should support filtering on boolean values with different operators', () => {
    interface Queryable { closed: boolean };
    class Q extends Query<Queryable, PrimitiveLeaves<Queryable>, CollectionLeaves<Queryable>> {};

    expect(new Q().where('closed', 'is', true).whereClause)
    .toStrictEqual({ where: { closed: { op: 'is', value: true } }});

    expect(new Q().where('closed', 'not', true).whereClause)
    .toStrictEqual({ where: { closed: { op: 'not', value: true } }});
})

test('Query should allow selection based on single root property', () => {
    interface Todo {
        id: number,
        title: string,
        due: Date
    };
    class TodoQuery extends Query<Todo, PrimitiveLeaves<Todo>,CollectionLeaves<Todo>> {};
    const q = new TodoQuery().where('id', 'eq', 1);

    expect(q.whereClause).toStrictEqual({
        where: {
            id: {
                op: "eq",
                value: 1
            }
        }
    })
})

test('Query should allow selection based on combined root properties', () => {
    interface Todo {
        id: number,
        title: string,
        due: Date
    };
    class TodoQuery extends Query<Todo, PrimitiveLeaves<Todo>,CollectionLeaves<Todo>> {};
    const q = new TodoQuery()
        .where('id', 'eq', 1)
        .where('title', 'contains', 'title')
        .where('due', 'gte', new Date('01-01-2024'));
    expect(q.whereClause).toStrictEqual({
        where: {
            id: {
                op: "eq",
                value: 1
            },
            title: {
                op: "contains",
                value: "title"
            },
            due: {
                op: "gte",
                value: new Date('01-01-2024')
            },
        }
    })
})

test('Query should allow selection based on nested object properties', () => {
    interface Category {
        id: number;
        name: string;
    }
    interface Todo {
        id: number;
        category: Category;
    };

    class TodoQuery extends Query<Todo, PrimitiveLeaves<Todo>,CollectionLeaves<Todo>> {};
    const q = new TodoQuery()
        .where('category.id', 'eq', 1)
        .where('category.name', 'contains', 'work');

    expect(q.whereClause).toStrictEqual({
        where: {
            "category.id": {
                op: "eq",
                value: 1
            },
            "category.name": {
                op: "contains",
                value: "work"
            }
        }
    })
})

test('Query should allow selection based on combined root and nested object properties', () => {
    interface Category {
        id: number;
        name: string;
    }
    interface Todo {
        id: number;
        title: string;
        category: Category;
    };

    class TodoQuery extends Query<Todo, PrimitiveLeaves<Todo>,CollectionLeaves<Todo>> {};
    const q = new TodoQuery()
        .where('title', 'contains', 'work')
        .where('category.id', 'eq', 1)
        .where('category.name', 'contains', 'work');

    expect(q.whereClause).toStrictEqual({
        where: {
            title: {
                op: "contains",
                value: "work"
            },
            "category.id": {
                op: "eq",
                value: 1
            },
            "category.name": {
                op: "contains",
                value: "work"
            }
        }
    })
})

test('Query should allow selection based on array properties aggregates', () => {
    interface User {
        id: number;
        todos: Todo[]
    }
    interface Todo {
        id: number;
        title: string;
    };

    class UserQuery extends Query<User, PrimitiveLeaves<User>,CollectionLeaves<User>> {};
    let q = new UserQuery()
        .whereCollection("some", "todos.id", "eq", 1);

    expect(q.whereClause).toStrictEqual({
        where: {
            some: {
                "todos.id": {
                    op: "eq",
                    value: 1
                }
            }
        }
    });

    q = new UserQuery()
        .whereCollection("some", "todos.title", "contains", "work");

    expect(q.whereClause).toStrictEqual({
        where: {
            some: {
                "todos.title": {
                    op: "contains",
                    value: "work"
                }
            }
        }
    });
})

test('Query should allow selection based on combined root and array properties aggregates', () => {
    interface User {
        id: number;
        todos: Todo[]
    }
    interface Todo {
        id: number;
        title: string;
    };

    class UserQuery extends Query<User, PrimitiveLeaves<User>,CollectionLeaves<User>> {};
    let q = new UserQuery()
        .where('id', 'eq', 1)
        .whereCollection("some", "todos.id", "eq", 1)
        .whereCollection("all", "todos.title", "contains", "work");

    expect(q.whereClause).toStrictEqual({
        where: {
            id: {
                op: "eq",
                value: 1
            },
            some: {
                "todos.id": {
                    op: "eq",
                    value: 1
                }
            },
            all: {
                "todos.title": {
                    op: "contains",
                    value: "work"
                }
            }
        }
    });
})