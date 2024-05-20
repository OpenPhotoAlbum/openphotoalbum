import { ButtonHTMLAttributes } from "react";
import './Button.styles.scss';

type ButtonVariant = 'primary' | 'secondary';

interface Button extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

const Btn = (props: Button) => {
    const { variant, children, ...rest } = props;

    const classes = ["Button"];

    if (variant) classes.push(variant);
    
    return (
        <button className={classes.join(' ')} {...rest}>{children}</button>
    )
}

export default Btn