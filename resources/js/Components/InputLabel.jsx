export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `text-blueGray-600 mb-2 block text-xs font-bold uppercase ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
