import XVRule from "../XVRule";

export default (name) => new XVRule("_field_name", () => true, [name]);