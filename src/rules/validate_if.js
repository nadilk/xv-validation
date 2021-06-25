import XVRule from "@/xv-validation/XVRule";
import callOrValue from "@/xv-validation/utils/callOrGetValue";

const IfValidator = async (validationData) => {
    let {target, rule: {args: [condition, rules]}, context, rule} = validationData;

    condition = callOrValue(condition,validationData);
    if (condition) {
        const validationRes = [];
        for (let childRule of rules) {
            childRule.path = rule.path;
            let valRes = await childRule.validate(target, context);
            if (!Array.isArray(valRes)) {
                valRes.rule = childRule;
                valRes = [valRes];
            }
            validationRes.push(...valRes);
        }
        return validationRes;
    } else {
        return true;
    }
};


export default (condition, rules) => new XVRule('validate_if', IfValidator, [condition, rules]);