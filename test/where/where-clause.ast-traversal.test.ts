import { Query } from "../../src/query-builder.abstraction";
import { CollectionLeaves, PrimitiveLeaves } from "../../src/query.types";

test('Query should support traversal of its generated whereClause AST', () => {
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
        .whereCollection("all", "todos.due", "gt", new Date('01-01-2024'));

    expect(q.whereClause.where.name?.op === "startswith");
    expect(q.whereClause.where.name?.value === "John");
    expect(q.whereClause.where.all?.["todos.due"]?.op === "eq");
    expect(q.whereClause.where.all?.["todos.due"]?.value === new Date('01-01-2024'));

    expect(q.whereClause.where.id?.op === undefined);
    expect(q.whereClause.where.id?.value === undefined);
    expect(q.whereClause.where.all?.["todos.id"]?.op === undefined);
    expect(q.whereClause.where.all?.["todos.id"]?.value === undefined);
})

test('Query should support traversal of its generated whereClause AST when containing an OR clause', () => {
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

    expect(q.whereClause.where.OR![0].where.name?.op === "startswith");
    expect(q.whereClause.where.OR![0].where.name?.value === "John");
    expect(q.whereClause.where.OR![1].where.name?.op === "endswith");
    expect(q.whereClause.where.OR![1].where.name?.value === "Doe");
})
