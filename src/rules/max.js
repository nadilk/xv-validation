import XVRule from "../XVRule";

const maxValidator = ({target:{value}, rule: {args: [max]}}) =>  {
    let valid;
    if (typeof value === "string" || Array.isArray(value)){
        valid = value.length <= max;
    }else{
        valid = value <= max
    }
    return valid;
}

export default (maxVal) => new XVRule("max", maxValidator, [maxVal]);