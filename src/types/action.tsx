type INotificationAction = {
    type: 'SHOW_SUCCESS' | 'SHOW_ERROR' | 'HIDE';
    payload: string;
};

interface IsetNotificatioFunc {
    <INotificationAction>(arg: INotificationAction): void;
}

export type { INotificationAction, IsetNotificatioFunc };
