import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest", // Use ts-jest preset for handling TypeScript
  testEnvironment: "node", // Set the environment to 'node' for backend testing
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Use ts-jest for TypeScript files
    "^.+\\.[jt]sx?$": "babel-jest", // Use babel-jest for JavaScript and JSX files
  },
  moduleFileExtensions: ["ts", "js", "json", "node"], // Supported module extensions
  transformIgnorePatterns: ["/node_modules/"], // Ignore transforming node_modules unless necessary
};

export default config;
