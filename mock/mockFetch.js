const DRIVERS = [
  { id: 101, name: "Maya Chen", email: "maya@quest.test", vehicle: "Bike" },
  { id: 102, name: "Andre Lewis", email: "andre@quest.test", vehicle: "Car" },
  { id: 103, name: "Nina Patel", email: "nina@quest.test", vehicle: "Scooter" }
];

const DELIVERIES = [
  { id: "D1", driverId: 101, status: "completed", amount: 18.50 },
  { id: "D2", driverId: 102, status: "completed", amount: 24.00 },
  { id: "D3", driverId: 101, status: "cancelled", amount: 13.00 },
  { id: "D4", driverId: 103, status: "completed", amount: 31.25 },
  { id: "D5", driverId: 102, status: "completed", amount: 19.50 },
  { id: "D6", driverId: 101, status: "completed", amount: 27.00 },
  { id: "D7", driverId: 103, status: "cancelled", amount: 15.00 },
  { id: "D8", driverId: 101, status: "completed", amount: 12.00 }
];

function makeResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return structuredClone(data);
    }
  };
}

export function installMockFetch() {
  globalThis.fetch = async function mockFetch(input) {
    const url = new URL(input);

    if (url.pathname.endsWith("/drivers")) {
      return makeResponse(DRIVERS);
    }

    if (url.pathname.endsWith("/deliveries")) {
      let result = DELIVERIES;

      const driverId = url.searchParams.get("driverId");
      const status = url.searchParams.get("status");
      const limit = url.searchParams.get("limit");

      if (driverId !== null) {
        result = result.filter(d => d.driverId === Number(driverId));
      }

      if (status !== null) {
        result = result.filter(d => d.status === status);
      }

      if (limit !== null && Number.isFinite(Number(limit))) {
        result = result.slice(0, Number(limit));
      }

      return makeResponse(result);
    }

    return makeResponse({ message: "Not found" }, 404);
  };
}
