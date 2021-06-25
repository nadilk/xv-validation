import XVRule from "@/xv-validation/XVRule";

export default () => new XVRule('required', ({target: {value}}) => {
    return value !== null && value !== undefined && (typeof value !== 'string' || value.length > 0)
}, [], {mandatory:true});