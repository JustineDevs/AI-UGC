import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("fixture provider adapter registration", () => {
  it("loads the sample provider adapter fixture", () => {
    const filePath = resolve(__dirname, "../providers/sample-provider-adapter.json");

    const data = JSON.parse(readFileSync(filePath, "utf8")) as {
      providerKey: string;
      capabilities: unknown[];
    };

    expect(data.providerKey).toBeDefined();
    expect(Array.isArray(data.capabilities)).toBe(true);
  });
});
