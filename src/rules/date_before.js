import XVRule from "../XVRule";
import moment from "moment";

const dateBeforeValidator = ({target: {value}, rule: {args: [date,format]}}) => {
    format = format || "YYYY-MM-DD";
    return moment(value, format).isBefore(date)
}

export default (date,format) => new XVRule("date_before", dateBeforeValidator, [date,format]);