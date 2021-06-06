import React from 'react';
import { createStyles, IconButton, InputBase, makeStyles, Menu, MenuItem, Paper, Theme } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import { IsearchData } from '../types/search';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 400,
        },
        form: {
            width: 200,
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
    }),
);

type searchBarProps = {
    searchData(data: IsearchData): void;
};

export default function SearchBar(props: searchBarProps): JSX.Element {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [searchType, setSearchType] = React.useState('symbol');
    const [searchText, setSearchText] = React.useState('');

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemSelected = (value: string) => {
        setSearchType(value);
        handleMenuClose();
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSearchTextChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSearchText(event.target.value as string);
    };

    const runSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        props.searchData({ searchType, searchText });
    };

    return (
        <React.Fragment>
            <Paper component="form" onSubmit={runSearch} className={classes.root}>
                <IconButton className={classes.iconButton} aria-label="menu" onClick={handleMenuOpen}>
                    <MenuIcon />
                </IconButton>
                <InputBase
                    className={classes.input}
                    placeholder={`Search for ${searchType}`}
                    value={searchText}
                    onChange={handleSearchTextChange}
                />
                <IconButton type="submit" className={classes.iconButton} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <Menu keepMounted anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => handleMenuItemSelected('symbol')}>Symbol</MenuItem>
                    <MenuItem onClick={() => handleMenuItemSelected('name')}>Name</MenuItem>
                </Menu>
            </Paper>
        </React.Fragment>
    );
}
