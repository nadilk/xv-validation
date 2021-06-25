import XVRule from "@/xv-validation/XVRule";

export default (name) => new XVRule('_field_name', () => true, [name]);