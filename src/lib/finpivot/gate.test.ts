import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pageAccess, PUBLIC_PATHS, STAFF_PATHS } from "./gate.ts";

describe("page access", () => {
  it("keeps the public site open and sends every desk path to login", () => {
    for (const path of PUBLIC_PATHS) assert.equal(pageAccess(path, null), "public");
    for (const path of STAFF_PATHS) assert.equal(pageAccess(path, null), "login");
    assert.equal(pageAccess("/staff/login", null), "login");
    assert.equal(pageAccess("/os", "support"), "staff");
    assert.equal(pageAccess("/orders", "owner"), "staff");
    assert.equal(pageAccess("/unknown", "owner"), "deny");
  });
});
