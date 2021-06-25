import XVContext from "../XVContext";

export default {
    install: (app) => {

        app.config.globalProperties.$xv_shared = {};

        app.mixin({
            data   : function () {
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
                    const ctx = this.$xv_getContextByName(context);
                    if (ctx)
                        ctx.validate(path);
                },
                $xv_resetValidation(path, context) {
                    const ctx = this.$xv_getContextByName(context);
                    if (ctx)
                        ctx.resetErrors(path);
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
                $xv_errors(attr, context, all) {
                    const ctx = this.$xv_getContextByName(context);
                    if (ctx) {
                        const allErrors = ctx.errors;
                        return allErrors.filter(e => e.target.path.startsWith(attr) && (e.show || all));
                    }
                    return null;
                },

                $xv_validated(attr, context) {
                    const ctx = this.$xv_getContextByName(context);
                    if (ctx) {
                        return ctx.validator.validated.some(val => val.startsWith(attr));
                    }
                    return null;
                },
                $xv_rules(attr, context) {
                    const ctx = this.$xv_getContextByName(context);
                    if (ctx) {
                        return ctx.validator.getRulesForPath(attr, true);
                    }
                },
                $xv_fieldName(attr, context) {
                    const ctx = this.$xv_getContextByName(context);
                    if (ctx) {
                        return ctx.getFieldNameFor(attr);
                    }
                },
                $xv_fieldData(attr, context) {
                    context = context || this.$xv_getDefaultContextName();
                    return {
                        field : this.$xv_fieldName(attr, context),
                        rules : this.$xv_rules(attr, context),
                        errors: this.$xv_errors(attr, context)
                    }
                }
            }
        })
    }
};