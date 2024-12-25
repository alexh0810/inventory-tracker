import { render, screen } from '@/test/test-utils';
import { Header } from '../header';

describe('Header', () => {
  it('renders navigation links', () => {
    render(<Header />);

    expect(screen.getByText('Stock Tracker')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
