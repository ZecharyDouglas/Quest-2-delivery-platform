// QUEST 2 — Domain Models
//
// This quest uses real JavaScript private fields (#field),
// not Symbols.

export class User {
  // TODO
  #email = "";
  constructor(id, name, email) {
    if (typeof id === "number") this.id = id;
    else throw new TypeError("Invalid id.");

    if (typeof name === "string" && name.length > 0) this.name = name.trim();
    else throw new TypeError("Invalid Name");
    if (typeof email === "string" && email.length > 0 && email.includes("@"))
      this.#email = email.trim();
    else throw new TypeError("Invalid Email.");
  }
  getEmail() {
    return this.#email;
  }
  updateEmail(newEmail) {
    if (
      typeof newEmail === "string" &&
      newEmail.length > 0 &&
      newEmail.includes("@")
    )
      this.#email = newEmail.trim();
    else throw new TypeError("Invalid Email.");
  }
}

export class Driver extends User {
  // TODO
  #earnings;
  constructor(id, name, email, vehicle, startingEarnings = 0) {
    super(id, name, email);
    if (typeof vehicle === "string" && vehicle.length > 0)
      this.vehicle = vehicle;
    if (
      typeof startingEarnings === "number" &&
      isFinite(startingEarnings) &&
      startingEarnings >= 0
    )
      this.#earnings = startingEarnings;
  }
  get earnings() {
    return this.#earnings;
  }
  completeDelivery(amount) {
    if (typeof amount === "number" && isFinite(amount) && amount > 0) {
      this.#earnings += amount;
      return this.#earnings;
    } else throw new TypeError("Invalid amount.");
  }
}
