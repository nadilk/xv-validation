import XValidator      from "./XValidator";
import XVContext       from "./XVContext";
import XVRule          from "./XVRule";
import XValidatePlugin from "./vue/XValidatePlugin";
import * as rules      from "./rules";

if (!module || !module.exports) {
    window.XValidator = XValidator;
    window.XVContext = XVContext;
    window.XVRule = XVRule;
    window.XValidatePlugin = XValidatePlugin;
    window.XV_rules = rules;
}
export {
    XValidator,
    XVContext,
    XVRule,
    XValidatePlugin
};
