import { Query } from "../../src/query-builder.abstraction";
import { PrimitiveLeaves, CollectionLeaves } from "../../src/query.types";

test('Query should support filtering with single OR clause', () => {
    interface User {
        id: number;
        name: string;
        todos: Todo[];
    }
    interface Todo {
        id: number;
        title: string;
        due: Date;
        user: User;
    };

    class UserQuery extends Query<User, PrimitiveLeaves<User>,CollectionLeaves<User>> {};
    let q = new UserQuery()
        .where("name", "startswith", "John")
        .orWhere(new UserQuery().where("name", "endswith", "Doe"));

    expect(q.whereClause).toStrictEqual({
        where: {
            OR: [
                { where: { name: { op: "startswith", value: "John" } } },
                { where: { name: { op: "endswith", value: "Doe" } } }
            ]
        }
    });
})

test('Query should support filtering with chained OR clauses', () => {
    interface User {
        id: number;
        name: string;
        todos: Todo[];
    }
    interface Todo {
        id: number;
        title: string;
        due: Date;
        user: User;
    };

    class UserQuery extends Query<User, PrimitiveLeaves<User>,CollectionLeaves<User>> {};
    let q = new UserQuery()
        .where("name", "startswith", "John")
        .orWhere(new UserQuery().where("name", "endswith", "Doe"))
        .orWhere(new UserQuery().where("name", "contains", "John Doe"));

    expect(q.whereClause).toStrictEqual({
        where: {
            OR:[
                {
                    where: { 
                        OR:[
                            { where: { name: { op: "startswith", value: "John" } } },
                            { where: { name: { op: "endswith", value: "Doe" } } }
                        ]
                    }
                },
                { where: { name: { op: "contains", value: "John Doe" } } }
            ]
        }
    });
})

test('Query should support filtering with nested OR clauses', () => {
    interface User {
        id: number;
        name: string;
        todos: Todo[];
    }
    interface Todo {
        id: number;
        title: string;
        due: Date;
        user: User;
    };

    class UserQuery extends Query<User, PrimitiveLeaves<User>,CollectionLeaves<User>> {};
    let q = new UserQuery()
        .where("name", "startswith", "John")
        .orWhere(
            new UserQuery()
                .where("name", "endswith", "Doe")
                .orWhere(new UserQuery().where("name", "contains", "John Doe"))
        );

    expect(q.whereClause).toStrictEqual({
        where: {
            OR: [
                { where: { name: { op: "startswith", value: "John" } } },
                { 
                    where: {
                        OR: [
                            { where: { name: { op: "endswith", value: "Doe" } } },
                            { where: { name: { op: "contains", value: "John Doe" } } }
                        ]
                    }
                }
            ]
        }
    });
})
