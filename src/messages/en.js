import moment from "moment";

export default {
    ":min"        : ({target: {value}, field, rule: {args: [min]}}) => {
        switch (typeof value) {
            case "string":
                return `The ${field} field must be longer or equal to ${min} symbols.`;
            default:
                return `The ${field} field must be greater or equal to ${min}.`
        }
    },
    ":max"        : ({target: {value}, field, rule: {args: [max]}}) => {
        switch (typeof value) {
            case "string":
                return `The ${field} field must be shorter or equal to ${max} symbols.`;
            default:
                return `The ${field} field must be less or equal to ${max}.`
        }
    },
    ":required"   : ({field}) => `The ${field} field is required.`,
    ":required_if": ({field}) => `The ${field} field is required.`,
    ":compared"   : ({
                         field,
                         context,
                         rule: {
                             args: [operator],
                             args
                         }
                     }) => `The "${field} ${operator} ${context.getFieldNameFor(args[1])}" expression must be true.`,

    ":date"          : ({
                            field,
                            rule: {
                                args: [format],
                            }
                        }) => `The ${field} field does not match the format '${format}'.`,
    ":date_before"   : ({
                            field,
                            rule: {
                                args: [date, format],
                            }
                        }) => `The ${field} field must be a date before ${moment(date).format(format)}.`,
    ":in_list"      : ({
                            field,
                            rule: {
                                args: [values],
                            }
                        }) => `The ${field} field does not exist in (${values.join(",")}).`,
    ":regex"         : ({
                            field,
                            rule: {
                                args: [, placeholder],
                            }
                        }) => `The ${field} field does not match with pattern ${placeholder || ""}.`,
    ":digits"        : ({
                            field,
                            rule: {
                                args: [length],
                            }
                        }) => `The ${field} field must be numeric${length && " and contain exactly " + length + " digits"}.`,
    ":digits_between": ({
                            field,
                            rule: {
                                args: [min, max],
                            }
                        }) => `The ${field} field must be numeric and must have a length between  ${min} and ${max}.`,
    ":required_with" : ({
                            field,
                            rule: {
                                args: [fields, together],
                            }
                        }) => `The ${field} field is required when ${together ? "all of the" : "at least one of the"} fields(${fields.join(",")}) is present and is not empty.`,

    ":required_without" : ({
                            field,
                            rule: {
                                args: [fields, together],
                            }
                        }) => `The ${field} field is required when ${together ? "all of the" : "at least one of the"} fields(${fields.join(",")}) is not present or empty.`,
}
