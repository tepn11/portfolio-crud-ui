import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { DataGrid, GridColDef, GridValueGetterParams, GridCellParams } from '@material-ui/data-grid';
import Title from './Title';
import SearchBar from './searchBar';
import { ICoin } from '../types/coins';
import { getAllCoins, searchCoinsByName, searchCoinsBySymbol } from '../services/coins';
import { IsearchData } from '../types/search';

const useStyles = makeStyles({
    root: {
        '& .gain': {
            color: '#329414',
            backgroundColor: '#adf1bc75',
            fontWeight: 'bold',
        },
        '& .loss': {
            color: '#ec0037',
            backgroundColor: '#f9bac591',
            fontWeight: 'bold',
        },
    },
});

type PortfolioProps = {
    getSelected(data: ICoin | null): void;
    dataUpdate: boolean;
    dataUpdateComplete(complete: boolean): void;
};

export default function Portfolio(props: PortfolioProps): JSX.Element {
    const classes = useStyles();
    const [select, setSelection] = useState<ICoin | null>(null);
    const [coinsList, setCoinsList] = useState<ICoin[] | []>([]);

    const computeTotal = (amount: number, price: number) => {
        return (amount * price).toFixed(2);
    };

    const computeGains = (buyTotal: number, CurrentTotal: number) => {
        return (CurrentTotal - buyTotal).toFixed(2);
    };

    const computePNL = (buyTotal: number, CurrentTotal: number) => {
        return `${((CurrentTotal / buyTotal) * 100 - 100).toFixed(2)}%`;
    };

    const columns: GridColDef[] = [
        { field: 'symbol', headerName: 'Symbol', sortable: true, width: 150 },
        { field: 'name', headerName: 'Name', sortable: true, width: 150 },
        { field: 'notes', headerName: 'Notes', width: 200 },
        { field: 'boughtAmount', headerName: 'Bought Amount', width: 180 },
        {
            field: 'boughtPrice',
            headerName: 'Bought Price',
            width: 170,
        },
        {
            field: 'boughtTotal',
            headerName: 'Bought Total',
            width: 170,
            valueGetter: (params: GridValueGetterParams) =>
                `${computeTotal(
                    Number(params.getValue(params.id, 'boughtAmount')),
                    Number(params.getValue(params.id, 'boughtPrice')),
                )}`,
        },
        {
            field: 'currentPrice',
            headerName: 'Current Price',
            width: 170,
        },
        {
            field: 'currentTotal',
            headerName: 'Current Total',
            width: 170,
            valueGetter: (params: GridValueGetterParams) =>
                `${computeTotal(
                    Number(params.getValue(params.id, 'boughtAmount')),
                    Number(params.getValue(params.id, 'currentPrice')),
                )}`,
        },
        {
            field: 'gains',
            headerName: 'Gains',
            width: 150,
            valueGetter: (params: GridValueGetterParams) =>
                `${computeGains(
                    Number(params.getValue(params.id, 'boughtTotal')),
                    Number(params.getValue(params.id, 'currentTotal')),
                )}`,
        },
        {
            field: 'PNL',
            headerName: 'PNL',
            width: 150,
            valueGetter: (params: GridValueGetterParams) =>
                `${computePNL(
                    Number(params.getValue(params.id, 'boughtTotal')),
                    Number(params.getValue(params.id, 'currentTotal')),
                )}`,
        },
    ];

    useEffect(() => {
        props.getSelected(select);
    }, [select]);

    useEffect(() => {
        if (props.dataUpdate) {
            getAllCoins()
                .then((coins) => {
                    if (coins && coins.length > 0) {
                        setCoinsList(coins);
                    }
                    props.dataUpdateComplete(true);
                })
                .catch((error) => {
                    console.error(error);
                    props.dataUpdateComplete(true);
                });
        }
        props.getSelected(select);
    }, [props.dataUpdate]);

    const handleSearch = (searchData: IsearchData) => {
        console.log(searchData);
        const { searchType, searchText } = searchData;
        if (searchType === 'name') {
            searchCoinsByName(searchText)
                .then((coins) => {
                    if (coins) {
                        setCoinsList(coins);
                    }
                    props.dataUpdateComplete(true);
                })
                .catch((error) => {
                    console.error(error);
                    props.dataUpdateComplete(true);
                });
        } else {
            searchCoinsBySymbol(searchText)
                .then((coins) => {
                    if (coins) {
                        setCoinsList(coins);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    return (
        <React.Fragment>
            <Grid container spacing={3} justify="space-between">
                <Grid item>
                    <Title>Portfolio</Title>
                </Grid>
                <Grid item>
                    <SearchBar searchData={handleSearch} />
                </Grid>
            </Grid>
            <div style={{ height: 600, width: '100%', paddingTop: 10 }} className={classes.root}>
                <DataGrid
                    getRowId={(row) => row._id}
                    rows={coinsList}
                    columns={columns}
                    pageSize={10}
                    onRowSelected={(newSelection) => {
                        console.log('newSelection', newSelection);
                        setSelection(newSelection.data as ICoin);
                    }}
                    getCellClassName={(params: GridCellParams) => {
                        if (params.field === 'gains') {
                            return Number(params.value) >= 0 ? 'gain' : 'loss';
                        }
                        if (params.field === 'PNL') {
                            if (params.value)
                                return Number(String(params.value).substr(0, String(params.value).length - 1)) >= 0
                                    ? 'gain'
                                    : 'loss';
                        }
                        return '';
                    }}
                />
            </div>
        </React.Fragment>
    );
}
