import { Query } from "../../src/query-builder.abstraction";
import { PrimitiveLeaves, CollectionLeaves } from "../../src/query.types";

test('Query should support filtering overide of yet defined leaf with same operator', () => {
    interface User {
        id: number;
    }

    class UserQuery extends Query<User, PrimitiveLeaves<User>,CollectionLeaves<User>> {};
    let q = new UserQuery()
        .where("id", "eq", 0)
        .where("id", "eq", 1)

    expect(q.whereClause).toStrictEqual({
        where: {
            id: {
                op: "eq",
                value: 1
            }
        }
    });
})

test('Query should support filtering overide of yet defined leaf with different operators', () => {
    interface User {
        id: number;
    }

    class UserQuery extends Query<User, PrimitiveLeaves<User>,CollectionLeaves<User>> {};
    let q = new UserQuery()
        .where("id", "eq", 0)
        .where("id", "neq", 1)

    expect(q.whereClause).toStrictEqual({
        where: {
            id: {
                op: "neq",
                value: 1
            }
        }
    });
})

test('Query should support filtering overide of yet defined leaf in same aggregate operation with same operator', () => {
    interface User {
        id: number;
        todos: Todo[];
    }
    interface Todo {
        id: number;
    }

    class UserQuery extends Query<User, PrimitiveLeaves<User>,CollectionLeaves<User>> {};
    let q = new UserQuery()
        .whereCollection("all", "todos.id", "gt_lt", [0, 10])
        .whereCollection("all", "todos.id", "gt_lt", [10, 20])

    expect(q.whereClause).toStrictEqual({
        where: {
            all: {
                "todos.id": {
                    op: "gt_lt",
                    value: [10, 20]
                }
            }
        }
    });
})

test('Query should support filtering overide of yet defined leaf in same aggregate operation with different operators', () => {
    interface User {
        id: number;
        todos: Todo[];
    }
    interface Todo {
        id: number;
    }

    class UserQuery extends Query<User, PrimitiveLeaves<User>,CollectionLeaves<User>> {};
    let q = new UserQuery()
        .whereCollection("all", "todos.id", "gt_lt", [0, 10])
        .whereCollection("all", "todos.id", "gte_lt", [10, 20])

    expect(q.whereClause).toStrictEqual({
        where: {
            all: {
                "todos.id": {
                    op: "gte_lt",
                    value: [10, 20]
                }
            }
        }
    });
})

test('Query should support filtering overide of yet defined leaf in different aggregate operations with same operator', () => {
    interface User {
        id: number;
        todos: Todo[];
    }
    interface Todo {
        id: number;
    }

    class UserQuery extends Query<User, PrimitiveLeaves<User>,CollectionLeaves<User>> {};
    let q = new UserQuery()
        .whereCollection("all", "todos.id", "gt_lt", [0, 10])
        .whereCollection("some", "todos.id", "gt_lt", [10, 20])

    expect(q.whereClause).toStrictEqual({
        where: {
            some: {
                "todos.id": {
                    op: "gt_lt",
                    value: [10, 20]
                }
            }
        }
    });
})

test('Query should support filtering overide of yet defined leaf in different aggregate operations with different operators', () => {
    interface User {
        id: number;
        todos: Todo[];
    }
    interface Todo {
        id: number;
    }

    class UserQuery extends Query<User, PrimitiveLeaves<User>,CollectionLeaves<User>> {};
    let q = new UserQuery()
        .whereCollection("all", "todos.id", "gt_lt", [0, 10])
        .whereCollection("some", "todos.id", "gte_lt", [10, 20])

    expect(q.whereClause).toStrictEqual({
        where: {
            some: {
                "todos.id": {
                    op: "gte_lt",
                    value: [10, 20]
                }
            }
        }
    });
})