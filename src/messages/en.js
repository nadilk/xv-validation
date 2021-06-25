import moment from "moment";

export default {
    ':min': ({target: {value}, field, rule: {args: [min]}}) => {
        switch (typeof value) {
            case "string":
                return `The minimum length of field ${field} is ${min} symbols.`;
            default:
                return `The minimum value of field ${field} is ${min}.`
        }
    },
    ':max': ({target: {value}, field, rule: {args: [min]}}) => {
        switch (typeof value) {
            case "string":
                return `The maxim length of field ${field} is ${min} symbols.`;
            default:
                return `The maxim value of field ${field} is ${min}.`
        }
    },
    ':required': ({field}) => `The ${field} field is required.`,
    ':required_if': ({field}) => `The ${field} field is required.`,
    ':compared': ({
                      field,
                      context,
                      rule: {
                          args: [operator],
                          args
                      }
                  }) => `The "${field} ${operator} ${context.getFieldNameFor(args[1])}" expression must be true.`,

    ':date': ({
                  field,
                  rule: {
                      args: [format],
                  }
              }) => `The ${field} does not match the format ${format}.`,
    ':date_before': ({
                         field,
                         rule: {
                             args: [date, format],
                         }
                     }) => `The ${field} must be a date before ${moment(date).format(format)}.`,
    ':in_array': ({
                      field,
                      rule: {
                          args: [values],
                      }
                  }) => `The ${field} field does not exist in (${values.join(',')}).`,
    ':regex': ({
                   field,
                   rule: {
                       args: [,placeholder],
                   }
               }) => `The ${field} field does not match with pattern ${placeholder || ''}.`,
}
