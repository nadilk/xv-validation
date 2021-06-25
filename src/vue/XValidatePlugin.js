import XVContext from "@/xv-validation/XVContext";

export default {
    install: (app) => {

        app.config.globalProperties.$xv_shared = {};

        app.mixin({
            data: function () {
                return {_xvalidate: {}}
            },
            methods: {
                $xv_getDefaultContextName() {
                    return Object.keys(this._xvalidate)[0];
                },
                $xv_getContextByName(name) {
                    name = name || this.$xv_getDefaultContextName();
                    return this._xvalidate[name] || this.$xv_shared[name] || null;
                },
                $xv_validate(path, context) {

                    this.$xv_getContextByName(context)?.validate(path);
                },
                $xv_resetValidation(path, context) {
                    this.$xv_getContextByName(context)?.resetErrors(path);
                },
                $xv_create(name, rules, getModel, share = false) {
                    this._xvalidate[name] = new XVContext({
                        name,
                        rules,
                        getModel
                    });
                    if (share) {
                        this.$xv_shared[name] = this._xvalidate[name];
                    }
                },
                $xv_errors(attr, context) {
                    const allErrors = this.$xv_getContextByName(context)?.errors;
                    return allErrors?.filter(e => e.target.path.startsWith(attr));
                },
                $xv_rules(attr, context) {
                    return this.$xv_getContextByName(context)?.validator.getRulesForPath(attr, true);
                },
                $xv_fieldName(attr, context) {
                    return this.$xv_getContextByName(context)?.getFieldNameFor(attr);
                },
                $xv_fieldData(attr, context) {
                    context = context || this.$xv_getDefaultContextName();
                    return {
                        field: this.$xv_fieldName(attr, context),
                        rules: this.$xv_rules(attr, context),
                        errors: this.$xv_errors(attr, context)
                    }
                }
            }
        })
    }
};