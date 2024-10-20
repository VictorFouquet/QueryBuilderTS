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

**Entities** should be simple value objects representing the schema of the client's database.

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

**PrimitiveLeaves** is a provided type that represents the entity fields types with a primitive value.

Currently in the code base, primitives are set to be `string | number | Date | boolean`.

This type will extract all the primitive leaves recursively, meaning that from the **Entity** example, it will also get the nested **House** leaves.

The nested leaves will be prepended with their associated key in the parent object, dot separated.

The result would be the following string union : `'id' | 'name' | house.id | house.size | house.construction | house.owner.id | house.owner.name`

Note that in the recursion process, even if we can get back to `owner` field through the `house` branch, the exploration stops when a yet visited type is encountered, thus we can't find `house.owner.house.id` in the union for instance.

#### Collection leaves

**CollectionLeaves** can be compared to the **PrimitiveLeaves** as they will also reference the keys associated to a primitive value.

The main difference is that **CollectionLeaves** have an array in the path that lead to them.

From the **Entity** example, the generated string union would be:

`cars.id | cars.model | cars.mileage | cars.owner.id | cars.owner.name | cars.owner.house.id | cars.owner.house.size | cars.owner.house.construction | house.owner.cars.id | house.owner.cars.model | house.owner.cars.mileage`

As we have seen in the **PrimitiveLeaves** example, we can get back to `cars` when exploring the `house` branch going through the owner, but the recursion will not get deeper, so the list of leaves is always a finite union.

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


## OrderBy clause

_Coming soon_