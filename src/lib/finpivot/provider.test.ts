import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Sql } from "../db.ts";
import {
  archiveEvidence,
  createSandboxEnvelope,
  moveSandbox,
  signWebhook,
  storeWebhookNonce,
  verifyWebhook,
} from "./provider.ts";

describe("e-sign provider adapter", () => {
  it("keeps sandbox envelopes unsigned", () => {
    const draft = createSandboxEnvelope("C-1");
    assert.equal(draft.provider, "PROVIDER_PENDING");
    assert.equal(draft.legallyBinding, false);
    const sent = moveSandbox(draft.state, "sent");
    assert.equal(sent.ok && sent.state, "sent");
    assert.equal(sent.ok && sent.legallyBinding, false);
    assert.equal(moveSandbox("draft", "sandbox_completed").ok, false);
  });

  it("checks the webhook signature and rejects a replay", () => {
    const seen = new Set<string>();
    const now = 1_700_000_000_000;
    const raw = '{"event":"sandbox"}';
    const nonce = "n-1";
    const timestamp = String(now);
    const signature = signWebhook("test-secret", timestamp, nonce, raw);
    const first = verifyWebhook({ secret: "test-secret", rawBody: raw, signature, timestamp, nonce, now, seen });
    const again = verifyWebhook({ secret: "test-secret", rawBody: raw, signature, timestamp, nonce, now, seen });
    assert.equal(first.ok, true);
    assert.equal(first.ok && first.legallyBinding, false);
    assert.match(again.reason, /已用过/);
    assert.equal(verifyWebhook({ secret: null, rawBody: raw, signature, timestamp, nonce: "n-2", now, seen }).ok, false);
    const stale = verifyWebhook({
      secret: "test-secret",
      rawBody: raw,
      signature: signWebhook("test-secret", String(now - 600_000), "n-3", raw),
      timestamp: String(now - 600_000),
      nonce: "n-3",
      now,
      seen,
    });
    assert.match(stale.reason, /重放/);
  });

  it("archives bytes without calling them a signature", () => {
    const archived = archiveEvidence(Buffer.from("synthetic-pdf"));
    assert.equal(archived.legallyBinding, false);
    assert.equal(archived.sha256.length, 64);
  });

  it("stores a webhook nonce once", async () => {
    const seen = new Set<string>();
    const query = async (text: string, params: readonly unknown[] = []) => {
      if (!text.startsWith("insert into fin_provider_nonce")) throw new Error(text);
      const nonce = String(params[0]);
      if (seen.has(nonce)) {
        const error = new Error("duplicate");
        Object.assign(error, { code: "23505" });
        throw error;
      }
      seen.add(nonce);
      return [];
    };
    const sql = {
      async transaction<T>(run: (query: Sql["query"]) => Promise<T>) {
        return run(query as Sql["query"]);
      },
    };
    const first = await storeWebhookNonce(sql, "nonce-1");
    const second = await storeWebhookNonce(sql, "nonce-1");
    assert.equal(first.ok && first.legallyBinding, false);
    assert.match(second.reason, /已用过/);
  });
});
