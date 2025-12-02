/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/default",    // preset correto
  testEnvironment: "node",

  roots: ["<rootDir>/src"],

  moduleFileExtensions: ["ts", "js", "json"],

  testMatch: ["**/*.spec.ts", "**/*.test.ts"],

  // 👇 Transformar uuid (ESM dentro do node_modules)
  transformIgnorePatterns: ["/node_modules/(?!(uuid)/)"],

  // 👇 Nova forma recomendada pra configurar ts-jest
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
};
