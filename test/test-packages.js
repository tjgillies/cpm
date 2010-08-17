var packages = require('../lib/packages');


exports['loadPackage'] = function (test) {
    var file = __dirname + '/fixtures/testpackage';

    packages.loadPackage(file, function (err, pkg, _design) {
        if(err) throw err;

        test.same(pkg, {
            name: 'testpackage',
            dependencies: [
                'testlib1',
                'testlib2'
            ],
            directories: {
                attachments: ["static"],
                templates: ["templates"],
                modules: ["lib"],
                properties: ["validate_doc_update.js", "shows", "views"]
            }
        });
        var static_dir = __dirname + '/fixtures/testpackage/static';
        test.same(_design.package, pkg);
        test.same(_design.templates, {
            'test.html': "module.exports = '<h1>\"\\'test\\'\"</h1>\\n';"
        });
        test.same(_design.lib, {
            'module': 'exports.test = "test module";\n',
            'module2': 'exports.test = "test module 2";\n'
            /*'app': 'exports.shows = {\n' +
            '    appshow: function (doc, req) {\n' +
            '        return doc._id + " shown";\n' +
            '    }\n' +
            '};\n'*/
        });
        test.equals(
            _design.validate_doc_update,
            'function (newDoc, oldDoc, userCtx) {\n' +
            '    // some validation function\n' +
            '}'
        );
        test.same(_design.shows, {
            'testshow': 'function (doc, req) {\n' +
            '    // some show function\n' +
            '}'
        });
        test.same(_design.views, {
            'testview': {
                map: 'function (doc) {\n' +
                '        emit(doc._id, doc);\n' +
                '    }'
             },
             'testview2': {
                map: 'function (doc) {\n' +
                '        emit(doc._id, doc);\n' +
                '    }'
             }
        });
        test.same(_design._attachments, {
            'static/folder/file1': static_dir + '/folder/file1',
            'static/file2': static_dir + '/file2',
            'static/file3': static_dir + '/file3'
        });
        test.same(Object.keys(_design).sort(), [
            'package',
            'templates',
            'lib',
            'validate_doc_update',
            'shows',
            'views',
            '_attachments'
        ].sort());
        test.done();
    });
};
