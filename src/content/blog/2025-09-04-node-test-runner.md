---
title: Using the node 18+ native test runner with TypeScript and React
publishedDate: 2025-09-04
category: notes
description: Node.js 18 introduced a native test runner that eliminates the need for jest, mocha or vitest in basic scenarios. 
---

Node.js 18 introduced a native test runner that eliminates the need for jest, mocha or vitest in basic scenarios. We've been using it exclusively for the past couple of weeks with great success.

## Configuration

The test script in package.json:

```json
{
  "scripts": {
    "test": "node --import global-jsdom/register --import tsx --experimental-transform-types --experimental-test-module-mocks --test"
  }
}
```

Flag breakdown:
- `--import tsx`: Handles TypeScript compilation
- `--import global-jsdom/register`: Provides DOM environment for React components
- `--experimental-transform-types`: Strips TypeScript types during execution
- `--experimental-test-module-mocks`: Enables module mocking
- `--test`: Activates Node's test runner

## Dependencies

Required dev dependencies:

```bash
pnpm add --save-dev @testing-library/react global-jsdom jsdom tsx
```

## TypeScript Unit Tests

```typescript
import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { getInitials } from "./stringUtils";

describe("String Utils", () => {
  test("should return correct initials", () => {
    const result = getInitials("John Smith");
    assert.equal(result, "JS");
  });
});
```

Uses Node's built-in assert module for assertions.

## React Component Testing

React Testing Library can still work with jsdom to provide a DOM.

```typescript
import React from "react";
import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import { Toggle } from "./Toggle";

beforeEach(() => {
  cleanup(); // cleans the dom state between each test
});

describe("Toggle", () => {
  test("calls onToggleClick when clicked", () => {
    let callCount = 0;
    const { getByText } = render(
      <Toggle 
        options={["On", "Off"]}
        selected="On"
        onToggleClick={() => callCount++}
      />
    );
    
    fireEvent.click(getByText("On"));
    assert.equal(callCount, 1);
  });
});
```

## Running Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm test -- --watch

# Specific file
node --import global-jsdom/register --import tsx --experimental-transform-types --test src/components/Toggle.test.tsx
```

## Comparison

**Advantages:**
- No configuration files required
- Direct TypeScript execution
- Built into Node.js runtime
- Smaller dependency footprint

**Limitations:**
- Requires Node 18+
- Uses experimental flags
- Smaller ecosystem than Jest, vitest, etc. This means fewer examples
