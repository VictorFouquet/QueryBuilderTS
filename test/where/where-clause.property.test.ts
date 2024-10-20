import { Query } from "../../src/query-builder.abstraction";
import { PrimitiveLeaves, CollectionLeaves } from "../../src/query.types";

test('Query should support filtering on single root property', () => {
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

test('Query should support filtering on combined root properties', () => {
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

test('Query should support filtering on nested object properties', () => {
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

test('Query should support filtering on combined root and nested object properties', () => {
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

test('Query should support filtering on array properties aggregates', () => {
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

test('Query should support filtering on combined leaves inside array properties aggregates', () => {
    interface User {
        id: number;
        todos: Todo[];
        cars: Car[];
    }
    interface Todo {
        id: number;
        title: string;
    }
    interface Car {
        id: number;
    }

    class UserQuery extends Query<User, PrimitiveLeaves<User>,CollectionLeaves<User>> {};
    let q = new UserQuery()
        .whereCollection("all", "todos.id", "gt_lt", [0, 10])
        .whereCollection("all", "todos.title", "contains", "work")
        .whereCollection("all", "cars.id", "gt_lt", [0, 10])

    expect(q.whereClause).toStrictEqual({
        where: {
            all: {
                "todos.id": {
                    op: "gt_lt",
                    value: [0, 10]
                },
                "todos.title": {
                    op: "contains",
                    value: "work"
                },
                "cars.id": {
                    op: "gt_lt",
                    value: [0, 10]
                }
            }
        }
    });
})

test('Query should support filtering on combined root and array properties aggregates', () => {
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

test('Query should support filtering on circular dependency', () => {
    interface User {
        id: number;
        todos: Todo[]
    }
    interface Todo {
        id: number;
        title: string;
        user: User;
    };

    class UserQuery extends Query<User, PrimitiveLeaves<User>,CollectionLeaves<User>> {};
    let q = new UserQuery()
        .whereCollection("all", "todos.user.id", "eq", 1);

    expect(q.whereClause).toStrictEqual({
        where: {
            all: {
                "todos.user.id": {
                    op: "eq",
                    value: 1
                }
            }
        }
    });
})
