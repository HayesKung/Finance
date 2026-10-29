import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  can,
  matchRole,
  nextRate,
  openSecret,
  readSession,
  resourceHash,
  sealSecret,
  signSession,
  tokenOpen,
} from "./access.ts";

describe("staff session", () => {
  it("rejects a missing, expired, or altered session", () => {
    const now = 1_000_000;
    const token = signSession("owner", now + 1000, "secret-key");
    assert.equal(readSession(token, "secret-key", now), "owner");
    assert.equal(readSession(token, "secret-key", now + 1000), null);
    assert.equal(readSession(token, "other-key", now), null);
    assert.equal(readSession(token.slice(0, -2) + "aa", "secret-key", now), null);
    assert.equal(readSession("", "secret-key", now), null);
  });

  it("gives support no key and no revoke rights", () => {
    assert.equal(matchRole("short", "owner-password", "support-password"), null);
    assert.equal(matchRole("owner-password", "owner-password", "support-password"), "owner");
    assert.equal(matchRole("support-password", "owner-password", "support-password"), "support");
    assert.equal(can(null, "publish"), false);
    assert.equal(can("support", "publish"), true);
    assert.equal(can("support", "saveChannel"), false);
    assert.equal(can("owner", "revoke"), true);
  });

  it("blocks a burst and then opens a new window", () => {
    const first = nextRate(0, 0, 0, 2, 1000);
    const second = nextRate(first.hits, first.windowStart, 10, 2, 1000);
    const third = nextRate(second.hits, second.windowStart, 20, 2, 1000);
    assert.equal(third.blocked, true);
    const later = nextRate(third.hits, third.windowStart, 2000, 2, 1000);
    assert.equal(later.blocked, false);
    assert.equal(later.hits, 1);
  });

  it("seals a channel secret so the stored text is not the original", () => {
    const sealed = sealSecret("api-secret-value", "data-key");
    assert.equal(sealed.includes("api-secret-value"), false);
    assert.equal(openSecret(sealed, "data-key"), "api-secret-value");
    assert.equal(openSecret(sealed, "other-key"), null);
    assert.equal(resourceHash("same").length, 16);
  });

  it("closes a revoked or expired customer link", () => {
    assert.equal(tokenOpen("2026-11-01T00:00:00.000Z", null, Date.parse("2026-10-29T00:00:00.000Z")), true);
    assert.equal(tokenOpen("2026-10-01T00:00:00.000Z", null, Date.parse("2026-10-29T00:00:00.000Z")), false);
    assert.equal(tokenOpen("2026-11-01T00:00:00.000Z", "2026-10-29T00:00:00.000Z", Date.parse("2026-10-29T00:00:00.000Z")), false);
    assert.equal(tokenOpen(null, null, Date.now()), false);
  });
});
