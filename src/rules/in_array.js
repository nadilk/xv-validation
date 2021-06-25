import XVRule from "@/xv-validation/XVRule";

const inArrayValidation = ({target: {value},rule: {args: [values]}}) => values.includes(value);


export default (values) => new XVRule('in_array', inArrayValidation, [values]);