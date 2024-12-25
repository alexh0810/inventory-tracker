import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ThemeProvider } from 'next-themes';

function render(
  ui: React.ReactElement,
  { mocks = [] as MockedResponse[], addTypename = false, ...renderOptions } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MockedProvider mocks={mocks} addTypename={addTypename}>
        <ThemeProvider
          enableSystem={false}
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
        >
          {children}
        </ThemeProvider>
      </MockedProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { render };
