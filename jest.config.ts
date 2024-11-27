import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',  // Use ts-jest preset for handling TypeScript
  testEnvironment: 'node',  // Set the environment to 'node' for backend testing
  "transform": {
  "\\.[jt]sx?$": "babel-jest",
  "\\.css$": "some-css-transformer",
},
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transformIgnorePatterns: ['/node_modules/(?!your-package-to-transform)'],  // Allow transforming specific node_modules (e.g., supertest, etc.)
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Ensure ts-jest uses the correct tsconfig file
    },
  },
}

export default config
