import XVRule from "@/xv-validation/XVRule";

const integerValidator = ({target: {value}}) => Number.isInteger(value)


export default () => new XVRule('integer', integerValidator, []);