var Instrumenter = require('../../lib/instrumenter');
var BasenameFileSet = require('../../lib/basename-file-set');
var utils = require('./../_utils');
var vm = require('vm');

var CoverageInfo = require('../../lib/obj/coverage-info');
var summaryReporter = require('../../reporters/summary');

describe('reporters', function () {
    describe('summary', function () {
        var instrumenter;

        beforeEach(function () {
            instrumenter = new Instrumenter(new BasenameFileSet(), __dirname, {
                varPrefix: '___', varPostfix: '___'
            });
        });

        afterEach(function () {
            utils.cleanupGlobal();
        });

        function run(code) {
            vm.runInThisContext(instrumenter.instrument(code.join('\n'), __dirname + '/code.js'));
            return CoverageInfo.fromJSON(utils.getMap());
        }

        it('should build line and function summary', function () {
            var coverageInfo = run([
                'function f(x) {',
                    'switch (x) {',
                        'case 0:',
                            'x++;',
                            'break;',
                        'case 1:',
                            'break;',
                    '}',
                '}',
                'function z(){};',
                'f(0);'
            ]);

            utils.captureConsole();
            summaryReporter(coverageInfo);
            utils.uncolor(utils.endCaptureConsole()).trim().should.equal(
                'Lines 86%\nFunctions 50%'
            );
        });
    });
});
