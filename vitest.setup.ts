import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Ensure React Testing Library unmounts trees between tests to avoid leakage.
afterEach(() => {
  cleanup();
});
