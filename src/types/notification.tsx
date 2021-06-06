type IAlertType = 'success' | 'error';
type INotification = {
    msg: string;
    type: IAlertType;
    show: boolean;
};

export type { INotification };
