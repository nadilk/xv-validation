import XVRule from "../XVRule";
import callOrValue from "../utils/callOrGetValue";
import isNotEmpty from "../utils/isNotEmpty";

export default (condition) => new XVRule("required_if", (validationData) => {
    let {target: {value}, rule: {args: [condition]}} = validationData;
    return !callOrValue(condition,validationData)
        || isNotEmpty(value);
}, [condition], {mandatory: condition});