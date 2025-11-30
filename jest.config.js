const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/src"],

  moduleFileExtensions: ["ts", "js", "json", "node"],

  testMatch: ["**/*.spec.ts", "**/*.test.ts"],

  // 👇 ESSA LINHA É O QUE CORRIGE O ERRO DO UUID
  transformIgnorePatterns: ["node_modules/(?!(uuid)/)"],

  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      useESM: true, // Permite interpretar exports do uuid
    },
  },

  // 👇 Ajuda o Jest a entender .ts como módulo
  extensionsToTreatAsEsm: [".ts"],
};
