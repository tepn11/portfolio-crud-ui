import { ICoin } from '../types/coins';
import { IAPIresponse } from '../types/response';

const API_URL = 'http://localhost:8080/';

export const getAllCoins = (): Promise<ICoin[] | null> => {
    return fetch(`${API_URL}coins`)
        .then((data) => data.json())
        .catch((err) => {
            console.error('Error', err);
            return null;
        });
};

export const searchCoinsBySymbol = (symbol: string): Promise<ICoin[] | null> => {
    return fetch(`${API_URL}coin/findBySymbol?value=${symbol}`)
        .then((data) => data.json())
        .catch((err) => {
            console.error('Error', err);
            return null;
        });
};

export const searchCoinsByName = (name: string): Promise<ICoin[] | null> => {
    return fetch(`${API_URL}coin/findByName?value=${name}`)
        .then((data) => data.json())
        .catch((err) => {
            console.error('Error', err);
            return null;
        });
};

export const getCoinPrice = (symbol: string): Promise<string | null> => {
    return fetch(`${API_URL}coinPrice?coin=${symbol}`)
        .then((data) => data.text())
        .catch((err) => {
            console.error('Error', err);
            return null;
        });
};

export const addNewCoin = (coinData: ICoin): Promise<IAPIresponse | null> => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coinData),
    };
    return fetch(`${API_URL}coin`, requestOptions)
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .catch((err) => {
            console.error('Error', err);
            return null;
        });
};

export const updateCoin = (coinData: ICoin): Promise<IAPIresponse | null> => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coinData),
    };
    return fetch(`${API_URL}coin/${coinData._id}`, requestOptions)
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .catch((err) => {
            console.error('Error', err);
            return null;
        });
};

export const deleteCoin = (coinData: ICoin): Promise<IAPIresponse | null> => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    };
    return fetch(`${API_URL}coin/${coinData._id}`, requestOptions)
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .catch((err) => {
            console.error('Error', err);
            return null;
        });
};
