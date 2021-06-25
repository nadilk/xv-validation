import XVRule from "@/xv-validation/XVRule";

export default (regex,placeholder) => new XVRule(
    'regex',
    ({
         target: {value},
         rule: {
             args: [regex]
         }
     }) => regex.test(value),
    [regex,placeholder]
);