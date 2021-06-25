import XVRule from "../XVRule";

const ifTypeofValidator = async ({target: {value}, rule: {args: [types, rules]}, context, rule, target}) => {
    if (types instanceof String)
        types = [types];
    if (types.includes(typeof value)) {
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


export default (types, rules) => new XVRule("if_typeof", ifTypeofValidator, [types, rules]);