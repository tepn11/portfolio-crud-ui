import { render, screen } from '@testing-library/react';
import Dashboard from './dashboard';

test('renders the portfolio', () => {
    render(<Dashboard />);
    const linkElement = screen.getByText(/Portfolio/i);
    expect(linkElement).toBeInTheDocument();
});

test('renders the action panel', () => {
    render(<Dashboard />);
    const linkElement = screen.getByText(/ADD COIN/i);
    expect(linkElement).toBeInTheDocument();
});
