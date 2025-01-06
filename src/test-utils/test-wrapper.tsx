import { ReactNode } from 'react';
import { MockedProvider } from '@apollo/client/testing';

interface TestWrapperProps {
  children: ReactNode;
  mocks?: any[];
}

export function TestWrapper({ children, mocks = [] }: TestWrapperProps) {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  );
}
