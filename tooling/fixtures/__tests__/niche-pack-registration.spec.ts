import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("fixture niche pack registration", () => {
  it("loads the sample custom niche pack fixture", () => {
    const filePath = resolve(
      __dirname,
      "../niche-packs/sample-custom-niche-pack.json",
    );

    const data = JSON.parse(readFileSync(filePath, "utf8")) as {
      key: string;
      promptModules: string[];
    };

    expect(data.key).toBeDefined();
    expect(Array.isArray(data.promptModules)).toBe(true);
  });
});
