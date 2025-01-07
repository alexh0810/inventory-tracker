import { ReactNode } from 'react';
import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import './router-mock'; // Import router mocks

interface TestWrapperProps {
  children: ReactNode;
  mocks?: MockedResponse[];
}

export function TestWrapper({ children, mocks = [] }: TestWrapperProps) {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  );
}
