import XVRule from "../XVRule";

const digitsBetweenValidation = ({target: {value}, rule: {args: [min, max]}}) => {
    let regexStr = "^\\d{" + min + "," + max + "}$";
    return (new RegExp(regexStr).test(value));
}


export default (min, max) => new XVRule("digits_between", digitsBetweenValidation, [min, max]);