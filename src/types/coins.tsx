type ICoin = {
    _id?: string;
    symbol: string;
    name: string;
    boughtAmount: number;
    boughtPrice: number;
    notes?: string;
    currentPrice?: number;
};

export type { ICoin };
