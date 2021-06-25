import XVRule from "../XVRule";

const minValidator = ({target:{value}, rule: {args: [min]}}) => {
    let valid;
    if (typeof value === "string" || Array.isArray(value)){
        valid = value.length >= min;
    }else{
        valid = value >= min
    }
    return valid;
}

export default (minVal) => new XVRule("min", minValidator, [minVal]);