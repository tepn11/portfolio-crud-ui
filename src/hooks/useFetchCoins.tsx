import { useEffect, useState } from 'react';
import { getAllCoins, getCoinPrice } from '../services/coins';
import { ICoin } from '../types/coins';

type ICoins = {
    data: ICoin[];
    loading: boolean;
};

export const useFetchAllCoins = (): ICoin[] => {
    const [state, setState] = useState<ICoins>({ data: [], loading: false });

    useEffect(() => {
        setState({ ...state, loading: true });
        getAllCoins().then((res) => {
            if (res !== null) {
                setState({ data: res, loading: false });
            }
        });
    }, [setState]);

    return state.data;
};

export const useFetchCoinPrice = (symbol: string): string | null => {
    const [state, setState] = useState<string | null>(null);

    useEffect(() => {
        getCoinPrice(symbol).then((res) => {
            if (res !== null) {
                setState(res);
            }
        });
    }, [setState]);

    return state;
};
