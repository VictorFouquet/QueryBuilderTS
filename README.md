# QueryBuilderTS

This project is aimed at providing a simple and lightweight library to build database queries as agnostic abstract syntax trees.

Its purpose is to offer an abstract layer for data queries, in order to decouple the client application from any ORM or database format restriction.

The actual implementation of query objects and AST are strongly typed, so that client doesn't run into the risk of creating error prone queries.

## Querying based on entities

### Implementing a Query class
The main object of the library is the abstract `Query` object.

It is the one clients should use to build there queries, providing three generic types when extending to a queryable object.

The three generic types to provide are :
- Entity
- PrimitiveLeaves
- CollectionLeaves

#### Entity

``Entities`` should be simple value objects representing the schema of the client's database.

For instance :

```typescript
interface User {
    id: number;
    name: string;
    house: House;
    cars: Car[];
}

interface House {
    id: number;
    size: number;
    construction: Date;
    owner: User;
}

interface Car {
    id: number;
    model: string;
    mileage: number;
    owner: User;
}
```
#### Primitive leaves

``PrimitiveLeaves`` is a provided type that represents the entity fields types with a primitive value.

Currently in the code base, primitives are set to be `string | number | Date | boolean`.

This type will extract all the primitive leaves recursively, meaning that from the ``Entity`` example, it will also get the nested ``House`` leaves.

The nested leaves will be prepended with their associated key in the parent object, dot separated.

The result would be the following string union : `'id' | 'name' | house.id | house.size | house.construction | house.owner.id | house.owner.name`

Note that in the recursion process, even if we can get back to `owner` field through the `house` branch, the exploration stops when a yet visited type is encountered, thus we can't find `house.owner.house.id` in the union for instance.

#### Collection leaves

``CollectionLeaves`` can be compared to the ``PrimitiveLeaves`` as they will also reference the keys associated to a primitive value.

The main difference is that ``CollectionLeaves`` have an array in the path that lead to them.

From the ``Entity`` example, the generated string union would be:

`cars.id | cars.model | cars.mileage | cars.owner.id | cars.owner.name | cars.owner.house.id | cars.owner.house.size | cars.owner.house.construction | house.owner.cars.id | house.owner.cars.model | house.owner.cars.mileage`

As we have seen in the ``PrimitiveLeaves`` example, we can get back to `cars` when exploring the `house` branch going through the owner, but the recursion will not get deeper, so the list of leaves is always a finite union.

#### Creating the query class

The implementation of a `Query` class is straightforward, client just have to provide the targetted `Entity` with its associated `PrimitiveLeaves` and `CollectionLeaves`.

```typescript
class UserQuery  extends Query<User,  PrimitiveLeaves<User>,  CollectionLeaves<User>> {};
class HouseQuery extends Query<House, PrimitiveLeaves<House>, CollectionLeaves<House>> {};
class CarQuery   extends Query<Car,   PrimitiveLeaves<Car>,   CollectionLeaves<Car>> {};
```

## Select clause

_Coming soon_

## Where clause

`Query` objects can be use to perform filtering operations.

`where` and `whereCollections` are currently supported.

### Where

The simple `where` function needs 3 arguments :
- key
- operator
- value

The `key` argument is one of the `Entity` leaves, either nested or not, but it should not be a leaf having an array in its path.

The `operator` argument is the comparison criteria.

There is three types of operators :

- `Numerical` being `'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte'` and can be applied to `number` and `Date` values
- `NumericalRangeOperators` being `'gt_lt' | 'gt_lte' | 'gte_lt' | 'gte_lte'` and can be applied to `number` and `Date` values
- `LitteralOperators` being `'eq' | 'neq' | 'contains' | 'startsWith' | 'endsWith'` and can be applied to `string` values
- `BooleanOperators` being `is | not` and can be applied to `boolean` values

The `value` is simply the value associated to the given `key` that will be used to perform the comparison.

Example usages :

```typescript
// Get user whose id equals one
userQuery.where('id', 'eq', 1);

// Get users whose name contains John
userQuery.where('name', 'contains', 'John');

// Get users whose house has been built after 01-01-2000
userQuery.where('house.construction', 'gt', new Date('2000-01-01'));

// Get user whose house's owner id is equal to one
// Inelegant equivalent to userQuery.where('id', 'eq', 1), but it works
userQuery.where('house.owner.id', 'eq', 1);
```

A compilation error will raise if the `key` can't be found in the `Entity` or its nested objects.

A compilation error will raise if the `operator` is not compatible with the value associated to the provided `key` argument.

A compilation error will raise if the `value` is not compatible with both the value associated to the provided `key` argument and the operator.

For instance :

```typescript
// This won't compile as `house.wrongfield` is not a valid leaf in the `User` entity.
userQuery.where("house.wrongfield", "contains", "example");

// This won't compile as `house.size` is not a string, thus a `contains` operator would not make sens.
userQuery.where("house.size", "contains", 5);

// This won't compile because even if `house.size` and `gt_lte` as they are a `number` associated field and a `NumericalRangeOperator`
// a simple `number` can't be used to perform an in range comparison.
userQuery.where("house.size", "gt_lte", 5);
```

### WhereCollection

The `whereCollection` method can be seen as an overlap around the `where` method, but it takes 4 arguments instead of 3, the first one being an `AggregateOperator`, and the 3 remaining ones following the `where` method arguments.

The library currently supports `all | none | some`.

It must be used in order to perform filtering on collection fields, such as `User.cars`.

Examples:

```typescript
// Query to get all users having any of their cars with a mileage under 50k
userQuery
    .whereCollection("some", "cars.mileage", "lt", 50000);

// Query to get all users having none of their cars with a mileage under 50k
userQuery
    .whereCollection("none", "cars.mileage", "lt", 50000);

// Query to get all users having all of their cars with a mileage under 50k
userQuery
    .whereCollection("all", "cars.mileage", "lt", 50000);
```

## OrderBy clause

_Coming soon_