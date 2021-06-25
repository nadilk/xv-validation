import XVRule                                from "../XVRule";
import {getValueByPath, recoverPathBySample} from "../utils/objectTravers";
import isNotEmpty                            from "../utils/isNotEmpty";

const ruleApplies = ({target: {path}, rule: {args: [fields, together]}, context}) => {
    return ((fields[together ? "every" : "some"])(f =>
        !isNotEmpty(
            getValueByPath(
                context.getModel(),
                recoverPathBySample(f, path),
                undefined
            )
        )
    ));
}


const requiredWithoutValidator = (validationData) => {
    return !ruleApplies(validationData) || isNotEmpty(validationData.target.value);
}


export default (fields, together) => {
    together = !!together;
    if (typeof fields === "string")
        fields = [fields];
    return new XVRule("required_without", requiredWithoutValidator, [fields, together], {mandatory: ruleApplies});
}