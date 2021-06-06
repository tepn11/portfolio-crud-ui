import { render, screen } from '@testing-library/react';
import ActionsPanel from './actionsPanel';
import { ICoin } from '../types/coins';

const coin: ICoin = { symbol: 'EEE', name: 'name', boughtAmount: 0, boughtPrice: 0 };
const triggerUpdateDataFn = jest.fn((cb) => cb(null, true));

test('Shows the edit coin if passed the selcted coin', () => {
    render(<ActionsPanel setSelectedCoin={coin} triggerUpdateData={triggerUpdateDataFn} />);
    const linkElement = screen.getByText(/EDIT COIN/i);
    expect(linkElement).toBeInTheDocument();
});

test('Shows the add coin modal when add new coin button is clicked', () => {
    render(<ActionsPanel setSelectedCoin={coin} triggerUpdateData={triggerUpdateDataFn} />);
    const linkElement = screen.getByText(/ADD COIN/i);
    linkElement.click();
    const modalDialogElement = screen.getByText(/ADD NEW COIN/i);
    expect(modalDialogElement).toBeInTheDocument();
});
