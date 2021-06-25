import XVRule from "../XVRule";

const digitsValidation = ({target: {value}, rule: {args: [length]}}) => {
    let regexStr = "^\\d" + (length > 0 ? ("{" + length + "}") : "+") + "$";
    return (new RegExp(regexStr).test(value));
}


export default (length) => new XVRule("digits", digitsValidation, [length]);