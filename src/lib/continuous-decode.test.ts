import { describe, expect, it } from "vitest";
import { portfolio } from "@/data/portfolio";
import { countDecodableCharacters, decodeText } from "@/lib/continuous-decode";

describe("continuous decode text", () => {
  it("masks only alphanumeric characters while preserving the eyebrow layout", () => {
    expect(decodeText(portfolio.hero.eyebrow, 0)).toBe(
      "XXXXXXXXXXX XXXXXXXXXXX XXXXXXXXX — XXXXXXX XXX",
    );
  });

  it("reveals the exact source text when every character has decoded", () => {
    expect(
      decodeText(portfolio.hero.eyebrow, countDecodableCharacters(portfolio.hero.eyebrow)),
    ).toBe(portfolio.hero.eyebrow);
  });

  it("decodes the edition indicator one character at a time", () => {
    expect(decodeText("001", 0)).toBe("XXX");
    expect(decodeText("001", 1)).toBe("0XX");
    expect(decodeText("001", 2)).toBe("00X");
    expect(decodeText("001", 3)).toBe("001");
  });
});
