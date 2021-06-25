import XVRule from "../XVRule";

const integerValidator = ({target: {value}}) => Number.isInteger(value)


export default () => new XVRule("integer", integerValidator, []);