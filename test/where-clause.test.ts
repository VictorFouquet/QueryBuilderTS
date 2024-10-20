import { Query } from "../src/query-builder.abstraction"
import { CollectionLeaves, PrimitiveLeaves } from "../src/query.types";

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