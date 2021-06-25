import XVRule from "../XVRule";

export default (paths) => new XVRule("_touches", () => true, [paths]);
