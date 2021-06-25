import XVRule from "../XVRule";
import isNotEmpty from "../utils/isNotEmpty";

export default () => new XVRule("required", ({target: {value}}) => {
    return isNotEmpty(value);
}, [], {mandatory:true});