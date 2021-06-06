import { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Portfolio from './porfolio';
import ActionsPanel from './actionsPanel';
import { ICoin } from '../types/coins';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24,
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    title: {
        flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
}));

export default function Dashboard(): JSX.Element {
    const classes = useStyles();
    const [selectedCoin, setSelectedCoin] = useState<ICoin | null>(null);
    const [dataUpdate, setDataUpdate] = useState<boolean>(true);

    const getSelectedCoin = (coin: ICoin) => {
        setSelectedCoin(coin);
    };
    const fetchNewData = (fetch: boolean) => {
        if (fetch) {
            setDataUpdate(true);
        }
    };
    const handleDataUpdateCompleted = (complete: boolean) => {
        if (complete) {
            setDataUpdate(false);
        }
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="absolute" className={clsx(classes.appBar)}>
                <Toolbar className={classes.toolbar}>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="xl" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Portfolio
                                    getSelected={getSelectedCoin}
                                    dataUpdate={dataUpdate}
                                    dataUpdateComplete={handleDataUpdateCompleted}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <ActionsPanel setSelectedCoin={selectedCoin} triggerUpdateData={fetchNewData} />
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
}
