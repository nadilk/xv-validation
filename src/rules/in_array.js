import {getValueByPath, recoverPathBySample} from "../utils/objectTravers";
import XVRule                                from "../XVRule";

const inArrayValidation = ({target: {value, path}, rule: {args: [arrayPath]}, context}) => {
    const checkArr = getValueByPath(context.getModel(), recoverPathBySample(arrayPath, path), null);
    if (Array.isArray(checkArr)) {
        return checkArr.includes(value);
    }
    return false;
};


export default (arrayPath) => new XVRule("in_array", inArrayValidation, [arrayPath]);