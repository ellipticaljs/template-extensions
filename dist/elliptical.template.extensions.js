(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'), require('dustjs'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils', 'dustjs'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical = root.elliptical || {};
        root.elliptical.extensions = root.elliptical.extensions || {};
        root.elliptical.extensions.template = factory(root.elliptical.utils, root.elliptical.$Template);
        root.returnExports = root.elliptical.extensions.template;
    }
}(this, function (utils, $Template) {
    var random = utils.random;

    return {

        precompile: function (template, id) {
            var $provider = $Template.$provider;
            template = template.replace(/&quot;/g, '"');
            var compiled = $provider.compile(template, id);
            $provider.loadSource(compiled);
        },

        renderTemplate: function (node, templateId, context, callback) {
            var $provider = $Template.$provider;
            $provider.render(templateId, context, function (err, out) {
                if (out || out === "") node.innerHTML = out;
                if (callback) callback(err, out);
            });
        },

        renderTemplateString: function (node, str, context, callback) {
            var id = 'template-' + random.str(6);
            this.precompile(str, id);
            this.renderTemplate(node, id, context, callback);
        },

        renderString: function (node, templateStr, context, callback) {
            this.renderTemplateString(node, templateStr, context, callback);
        },

        template: function (templateId, context, callback) {
            $Template.render(templateId, context, callback);
        },

        render: function (node, templateId, context, callback) {
            $Template.render(templateId, context, function (err, out) {
                if (!err) node.innerHTML = out;
                if (callback) callback(err, out);
            });
        },

        append: function (node, templateId, context, callback) {
            $Template.render(templateId, context, function (err, out) {
                var fragment;
                if (!err) {
                    fragment = $.parseHTML(out);
                    $(node).append(fragment);
                }
                if (callback) callback(err, fragment);
            });
        },

        prepend: function (node, templateId, context, callback) {
            $Template.render(templateId, context, function (err, out) {
                var fragment;
                if (!err) {
                    fragment = $.parseHTML(out);
                    $(node).prepend(fragment);
                }
                if (callback) callback(err, fragment);
            });
        }

    };
}));

