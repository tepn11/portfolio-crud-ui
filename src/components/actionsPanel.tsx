import React, { Reducer, useReducer, useState, useEffect } from 'react';

import { Formik, Form, Field } from 'formik';
import { Button, LinearProgress } from '@material-ui/core';
import { TextField } from 'formik-material-ui';

import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { ICoin } from '../types/coins';
import { addNewCoin, updateCoin, deleteCoin } from '../services/coins';

import { INotification } from '../types/notification';
import { INotificationAction } from '../types/action';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const initialNotificationState: INotification = {
    show: false,
    msg: '',
    type: 'error',
};

const notificationReducer: Reducer<INotification, INotificationAction> = (
    state: INotification,
    action: INotificationAction,
) => {
    switch (action.type) {
        case 'SHOW_SUCCESS':
            return { ...state, show: true, msg: action.payload, type: 'success' };
        case 'SHOW_ERROR':
            return { show: true, msg: action.payload, type: 'error' };
        case 'HIDE':
            return { ...state, show: false, msg: action.payload, type: 'error' };
        default:
            return state;
    }
};

type actionPanelProps = {
    setSelectedCoin: ICoin | null;
    triggerUpdateData(update: boolean): void;
};

export default function ActionsPanel(props: actionPanelProps): JSX.Element {
    const [showAddModal, setshowAddModal] = useState<boolean>(false);
    const [showEditModal, setshowEditModal] = useState<boolean>(false);
    const [showConfirmDelete, setshowConfirmDelete] = useState<boolean>(false);
    const [isloading, setLoading] = useState<boolean>(false);
    const [selectedCoin, setSelectedCoin] = useState<ICoin | null>(null);
    const [notification, dispatchNotification] = useReducer(notificationReducer, initialNotificationState);

    const handleCloseAddEditModal = () => {
        setshowAddModal(false);
        setshowEditModal(false);
    };

    const handleCloseConfirmDelete = () => {
        setshowConfirmDelete(false);
    };

    useEffect(() => {
        setSelectedCoin(props.setSelectedCoin);
    }, [props.setSelectedCoin]);

    const handleSubmit = (coinData: ICoin) => {
        setLoading(true);
        if (showEditModal && selectedCoin) {
            coinData._id = selectedCoin._id;
            return updateCoin(coinData)
                .then((res) => {
                    setLoading(false);
                    if (res?.success) {
                        dispatchNotification({ payload: 'Successfully updated coin', type: 'SHOW_SUCCESS' });
                        props.triggerUpdateData(true);
                        handleCloseAddEditModal();
                    } else dispatchNotification({ payload: 'Error updating coin', type: 'SHOW_ERROR' });
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                    dispatchNotification({ payload: 'Error updating coin', type: 'SHOW_ERROR' });
                });
        } else {
            return addNewCoin(coinData)
                .then((res) => {
                    setLoading(false);
                    if (res?.success) {
                        dispatchNotification({
                            payload: 'Successfully added new coin to portfolio',
                            type: 'SHOW_SUCCESS',
                        });
                        props.triggerUpdateData(true);
                        handleCloseAddEditModal();
                    } else dispatchNotification({ payload: 'Error adding coin to portfolio', type: 'SHOW_ERROR' });
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                    dispatchNotification({ payload: 'Error adding coin to portfolio', type: 'SHOW_ERROR' });
                });
        }
    };

    const handleDelete = () => {
        if (selectedCoin) {
            setLoading(true);
            return deleteCoin(selectedCoin)
                .then((res) => {
                    setLoading(false);
                    if (res?.success) {
                        dispatchNotification({ payload: 'Successfully deleted coin', type: 'SHOW_SUCCESS' });
                        props.triggerUpdateData(true);
                    } else dispatchNotification({ payload: 'Error deleting coin', type: 'SHOW_ERROR' });
                    setshowConfirmDelete(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                    dispatchNotification({ payload: 'Error deleting coin', type: 'SHOW_ERROR' });
                });
        } else dispatchNotification({ payload: 'No coin selected', type: 'SHOW_ERROR' });
    };

    const handleCloseAlert = () => {
        dispatchNotification({ type: 'HIDE', payload: '' });
    };

    return (
        <React.Fragment>
            <Grid container spacing={1}>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={() => setshowAddModal(true)}>
                        Add Coin
                    </Button>
                </Grid>
                {selectedCoin ? (
                    <React.Fragment>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => setshowEditModal(true)}>
                                Edit Coin
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => setshowConfirmDelete(true)}>
                                Delete Coin
                            </Button>
                        </Grid>
                    </React.Fragment>
                ) : null}
            </Grid>
            <Dialog
                open={showAddModal || showEditModal}
                onClose={handleCloseAddEditModal}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">{showEditModal ? 'Edit Coin' : 'Add New Coin'}</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            symbol: showEditModal && selectedCoin ? selectedCoin.symbol : '',
                            name: showEditModal && selectedCoin ? selectedCoin.name : '',
                            boughtPrice: showEditModal && selectedCoin ? selectedCoin.boughtPrice : 0,
                            boughtAmount: showEditModal && selectedCoin ? selectedCoin.boughtAmount : 0,
                            notes: showEditModal && selectedCoin ? selectedCoin.notes : '',
                        }}
                        validate={(values) => {
                            const errors: Partial<ICoin> = {};
                            if (!values.symbol) {
                                errors.symbol = 'Required';
                            }
                            if (!values.name) {
                                errors.name = 'Required';
                            }
                            return errors;
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({ submitForm, isSubmitting }) => (
                            <Form>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="symbol"
                                            type="text"
                                            label="Symbol"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="name"
                                            type="text"
                                            label="Name"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="boughtPrice"
                                            type="number"
                                            label="Bought Price"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="boughtAmount"
                                            type="number"
                                            label="Bought Amount"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            name="notes"
                                            type="text"
                                            label="Notes"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                                <DialogActions>
                                    <Button onClick={handleCloseAddEditModal} color="primary">
                                        Cancel
                                    </Button>
                                    <Button color="primary" disabled={isSubmitting} onClick={submitForm}>
                                        {selectedCoin ? 'Save' : 'Add'}
                                    </Button>
                                </DialogActions>
                                {isloading && <LinearProgress />}
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
            <Dialog open={showConfirmDelete} onClose={handleCloseConfirmDelete} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove {selectedCoin ? selectedCoin.name : 'this coin'} from the
                        portfolio?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={notification.show} autoHideDuration={5000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={notification.type}>
                    {notification.msg}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}
