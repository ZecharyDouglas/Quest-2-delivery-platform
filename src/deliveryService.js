import { Driver } from "./models.js";

/**
 * Build the deliveries endpoint URL.
 */
export function buildDeliveriesUrl(baseUrl, options = {}) {
  // TODO
  if (typeof baseUrl === "string" && baseUrl.length > 0) {
    baseUrl = baseUrl.trim();
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }
    baseUrl += "/deliveries";
  } else {
    throw new TypeError("Invalid URL provided");
  }

  let url = new URL(baseUrl);

  // optional parameters
  // `driverId`
  // - `status`
  // - `limit`
  if (options.driverId && typeof options.driverId === "number")
    url.searchParams.set("driverId", `${options.driverId}`);

  if (options.status && typeof options.status === "string")
    url.searchParams.set("status", options.status);

  if (options.limit && typeof options.limit === "number")
    url.searchParams.set("limit", options.limit);
  return url;
}

/**
 * Fetch driver records.
 */
export async function fetchDrivers(baseUrl) {
  // TODO
  baseUrl += "/drivers";
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new TypeError("Could not fetch data succesfully.");
  }
  const data = await response.json();
  // console.log(data);
  return data;
}

/**
 * Fetch delivery records.
 */
export async function fetchDeliveries(baseUrl, options = {}) {
  // TODO
  const url = buildDeliveriesUrl(baseUrl, options);
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new TypeError("URL failure");
      }
      return res.json();
    })
    .catch(() => {
      throw new TypeError("Nothing works");
    });
}

/**
 * Convert raw API records into Driver instances.
 */
export function createDrivers(records) {
  // TODO
}

/**
 * Associate each Driver with that driver's deliveries.
 */
export function attachDeliveries(drivers, deliveries) {
  // TODO
}

/**
 * Summarize one driver's delivery history.
 */
export function summarizeDriver(driverRecord) {
  // TODO
}

/**
 * Rank summaries without mutating the input.
 */
export function rankDriverSummaries(summaries) {
  // TODO
}

/**
 * Fetch, transform, summarize, and rank all drivers.
 */
export async function getDriverLeaderboard(baseUrl) {
  // TODO
}
