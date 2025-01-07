import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { TestWrapper } from './test-wrapper';
import * as React from 'react';
import type { DocumentNode } from '@apollo/client';

interface MockType {
  request: {
    query: DocumentNode;
    variables?: Record<string, unknown>;
  };
  result?: Record<string, unknown>;
  error?: Error;
}

interface WrapperProps {
  children: React.ReactNode;
}

const customRender = (
  ui: React.ReactElement,
  options: { mocks?: MockType[] } = {}
) => {
  const { mocks = [], ...renderOptions } = options;
  const Wrapper = ({ children }: WrapperProps) => (
    <TestWrapper mocks={mocks}>{children}</TestWrapper>
  );
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export { customRender as render };
export * from '@testing-library/react';
