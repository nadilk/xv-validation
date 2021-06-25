import XVRule from "@/xv-validation/XVRule";
import callOrValue from "@/xv-validation/utils/callOrGetValue";

export default (condition) => new XVRule('required_if', (validationData) => {
    let {target: {value}, rule: {args: [condition]}} = validationData;
    return !callOrValue(condition,validationData)
        || (value !== null && value !== undefined && value !== '')
}, [condition], {mandatory: condition});