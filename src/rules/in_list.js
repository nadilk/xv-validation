import XVRule from "../XVRule";

const validator = ({target: {value},rule: {args: [values]}}) => values.includes(value);


export default (values) => new XVRule("in", validator, [values]);