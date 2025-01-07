import { render } from '@testing-library/react';
import { TestWrapper } from '@/test-utils/test-wrapper';
import type { MockedResponse } from '@apollo/client/testing';

type CustomRenderOptions = {
  mocks?: MockedResponse[];
} & Parameters<typeof render>[1];

const customRender = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper mocks={options.mocks}>{children}</TestWrapper>
    ),
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };
