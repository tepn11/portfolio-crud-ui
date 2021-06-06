import Typography from '@material-ui/core/Typography';

type Props = {
    children: string;
};

export default function Title(props: Props): JSX.Element {
    return (
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {props.children}
        </Typography>
    );
}
