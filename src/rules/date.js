import XVRule from "../XVRule";
import moment from "moment";

const dateValidator = ({target: {value}, rule: {args: [format]}}) => {
    format = format || "YYYY-MM-DD";
    return moment(value, format).format(format) === value
}

export default (format) => new XVRule("date", dateValidator, [format]);