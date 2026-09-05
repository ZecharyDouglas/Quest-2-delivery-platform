# Quest 2 — Delivery Platform 🚚

Quest 2 builds on the JavaScript concepts from Quest 1 instead of replacing them.

Run:

```bash
npm test
```

Node 18+ required.

## Scenario

You're implementing the client-side domain layer for a delivery platform.

The mock server exposes:

- `/drivers`
- `/deliveries`

Your job is to model users and drivers with classes, protect internal state with JavaScript private fields, fetch API data, transform it, and produce delivery summaries.

## Concepts deliberately exercised

- classes and constructors
- inheritance with `extends`
- `super()`
- instance methods
- **private fields (`#field`)**
- getters
- async / await
- `fetch`
- HTTP error handling
- `URL` and `URLSearchParams`
- `map`, `filter`, `reduce`, `sort`
- object transformation
- orchestration across multiple functions
- tests

## Objectives

### 1. `User`

Create a `User` class.

Constructor:

- `id`
- `name`
- `email`

Store `email` in a **private field**.

Expose:

- `getEmail()`
- `updateEmail(newEmail)`

Reject an empty/blank email with an `Error`.

### 2. `Driver extends User`

Constructor:

- `id`
- `name`
- `email`
- `vehicle`
- `startingEarnings = 0`

Requirements:

- inherit from `User`
- use `super(...)`
- store earnings in a **private field**
- expose a read-only `earnings` getter
- implement `completeDelivery(amount)`

`completeDelivery(amount)` must:

- reject values <= 0
- add the amount to private earnings
- return the updated earnings

### 3. `buildDeliveriesUrl(baseUrl, options)`

Build `/deliveries`.

Optional query parameters:

- `driverId`
- `status`
- `limit`

Handle whitespace and a trailing slash in `baseUrl`.

### 4. `fetchDrivers(baseUrl)`

Fetch `/drivers`.

Throw an `Error` for a non-OK response.

Return parsed JSON.

### 5. `fetchDeliveries(baseUrl, options)`

Use `buildDeliveriesUrl`.

Throw an `Error` for a non-OK response.

Return parsed JSON.

### 6. `createDrivers(records)`

Turn raw driver records into `Driver` instances.

### 7. `attachDeliveries(drivers, deliveries)`

Return NEW objects shaped like:

```js
{
  (driver, deliveries);
}
```

Each driver's `deliveries` array should contain only deliveries belonging to that driver.

Do not mutate the input arrays.

### 8. `summarizeDriver(driverRecord)`

Given one object from `attachDeliveries`, return:

```js
{
  (driverId, name, completedCount, cancelledCount, totalRevenue);
}
```

Use array methods rather than manual precomputed values.

### 9. `rankDriverSummaries(summaries)`

Return a NEW array sorted by:

1. `totalRevenue` descending
2. `completedCount` descending when revenue ties

Do not mutate the original.

### 10. `getDriverLeaderboard(baseUrl)`

Orchestrate the complete pipeline:

1. fetch drivers
2. fetch deliveries
3. create `Driver` instances
4. attach deliveries
5. summarize each driver
6. rank summaries
7. return the leaderboard

## Quest rule

The implementation files contain no solutions.

Try not to open `mock/mockFetch.js` unless you're debugging the fake server itself. Let the tests tell you what your code is doing.

Private fields use modern JavaScript syntax:

```js
class Example {
  #secret;
}
```

Quest 2 expects you to figure out where and how to use them.
