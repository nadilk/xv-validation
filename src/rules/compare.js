import XVRule from "../XVRule";
import {getValueByPath, recoverPathBySample} from "../utils/objectTravers";


const comparedValidator = ({target: {path,value}, rule: {args: [operator, compareValue]}, context}) => {

    if (typeof compareValue === "function") {
        compareValue = compareValue();
    } else if (typeof compareValue === "string") {
        compareValue = recoverPathBySample(compareValue, path);
        if(compareValue.indexOf("*") !== -1){
            throw new Error("cannot guess the path of the compared value!")
        }
        compareValue = getValueByPath(context.getModel(), compareValue);
    }

    switch (operator){
        case "===":
            return value === compareValue;
        case "==":
            return value == compareValue;
        case ">":
            return value > compareValue;
        case ">=":
            return value >= compareValue;
        case "<":
            return value < compareValue;
        case "<=":
            return value <= compareValue;
    }
}

export default (operator,compareValue) => new XVRule("compared", comparedValidator, [operator,compareValue]);