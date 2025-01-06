import { render } from '@testing-library/react';
import { TestWrapper } from '@/test-utils/test-wrapper';

const customRender = (ui: React.ReactElement, options = {}) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper mocks={options.mocks}>{children}</TestWrapper>
    ),
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };
