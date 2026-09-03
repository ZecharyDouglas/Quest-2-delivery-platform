import test from "node:test";
import assert from "node:assert/strict";

import { User, Driver } from "../src/models.js";
import {
  buildDeliveriesUrl,
  fetchDrivers,
  fetchDeliveries,
  createDrivers,
  attachDeliveries,
  summarizeDriver,
  rankDriverSummaries,
  getDriverLeaderboard
} from "../src/deliveryService.js";

import { installMockFetch } from "../mock/mockFetch.js";

installMockFetch();

const BASE = "https://quest.local/api/";

test("1) User stores data and allows controlled email updates", () => {
  const user = new User(1, "Zed", "zed@test.com");

  assert.equal(user.id, 1);
  assert.equal(user.name, "Zed");
  assert.equal(user.getEmail(), "zed@test.com");

  user.updateEmail("new@test.com");
  assert.equal(user.getEmail(), "new@test.com");

  assert.throws(() => user.updateEmail("   "), Error);
});

test("2) Driver inherits from User and manages private earnings", () => {
  const driver = new Driver(2, "Kai", "kai@test.com", "Bike", 10);

  assert.equal(driver instanceof User, true);
  assert.equal(driver.vehicle, "Bike");
  assert.equal(driver.earnings, 10);

  assert.equal(driver.completeDelivery(7.5), 17.5);
  assert.equal(driver.earnings, 17.5);
  assert.throws(() => driver.completeDelivery(0), Error);
  assert.throws(() => driver.completeDelivery(-5), Error);
});

test("3) private state is not exposed as ordinary object properties", () => {
  const user = new User(1, "Zed", "zed@test.com");
  const driver = new Driver(2, "Kai", "kai@test.com", "Bike", 10);

  assert.equal(Object.hasOwn(user, "email"), false);
  assert.equal(Object.hasOwn(driver, "earnings"), false);
});

test("4) buildDeliveriesUrl creates the endpoint and query parameters", () => {
  const result = new URL(
    buildDeliveriesUrl("  https://quest.local/api/ ", {
      driverId: 101,
      status: "completed",
      limit: 2
    })
  );

  assert.equal(result.pathname, "/api/deliveries");
  assert.equal(result.searchParams.get("driverId"), "101");
  assert.equal(result.searchParams.get("status"), "completed");
  assert.equal(result.searchParams.get("limit"), "2");
});

test("5) fetchDrivers and fetchDeliveries parse API data", async () => {
  const drivers = await fetchDrivers(BASE);
  const deliveries = await fetchDeliveries(BASE, {
    driverId: 101,
    status: "completed"
  });

  assert.equal(drivers.length, 3);
  assert.equal(deliveries.length, 3);
  assert.equal(deliveries.every(d => d.driverId === 101), true);
  assert.equal(deliveries.every(d => d.status === "completed"), true);
});

test("6) createDrivers creates actual Driver instances", () => {
  const result = createDrivers([
    { id: 7, name: "Sam", email: "sam@test.com", vehicle: "Car" }
  ]);

  assert.equal(result.length, 1);
  assert.equal(result[0] instanceof Driver, true);
  assert.equal(result[0].name, "Sam");
  assert.equal(result[0].getEmail(), "sam@test.com");
});

test("7) attachDeliveries associates records without mutating inputs", () => {
  const drivers = [
    new Driver(1, "A", "a@test.com", "Bike"),
    new Driver(2, "B", "b@test.com", "Car")
  ];

  const deliveries = [
    { id: "x", driverId: 1, status: "completed", amount: 10 },
    { id: "y", driverId: 2, status: "completed", amount: 20 },
    { id: "z", driverId: 1, status: "cancelled", amount: 5 }
  ];

  const originalDeliveries = structuredClone(deliveries);
  const result = attachDeliveries(drivers, deliveries);

  assert.equal(result[0].driver, drivers[0]);
  assert.deepEqual(result[0].deliveries.map(d => d.id), ["x", "z"]);
  assert.deepEqual(result[1].deliveries.map(d => d.id), ["y"]);
  assert.deepEqual(deliveries, originalDeliveries);
});

test("8) summarizeDriver calculates counts and completed revenue", () => {
  const record = {
    driver: new Driver(1, "A", "a@test.com", "Bike"),
    deliveries: [
      { status: "completed", amount: 10 },
      { status: "cancelled", amount: 99 },
      { status: "completed", amount: 15.5 }
    ]
  };

  assert.deepEqual(summarizeDriver(record), {
    driverId: 1,
    name: "A",
    completedCount: 2,
    cancelledCount: 1,
    totalRevenue: 25.5
  });
});

test("9) rankDriverSummaries sorts a copy by revenue then completed count", () => {
  const input = [
    { driverId: 1, totalRevenue: 40, completedCount: 2 },
    { driverId: 2, totalRevenue: 60, completedCount: 1 },
    { driverId: 3, totalRevenue: 40, completedCount: 3 }
  ];

  const before = structuredClone(input);
  const result = rankDriverSummaries(input);

  assert.deepEqual(result.map(x => x.driverId), [2, 3, 1]);
  assert.deepEqual(input, before);
});

test("10) getDriverLeaderboard runs the entire Quest 2 pipeline", async () => {
  const result = await getDriverLeaderboard(BASE);

  assert.deepEqual(
    result.map(x => [x.driverId, x.totalRevenue, x.completedCount]),
    [
      [101, 57.5, 3],
      [102, 43.5, 2],
      [103, 31.25, 1]
    ]
  );
});
