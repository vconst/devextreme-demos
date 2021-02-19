import glob from 'glob';
import { Selector } from 'testcafe';

fixture`Getting Started`;

const getDemoPaths = (platform) => {
    return glob.sync(`JSDemos/Demos/**/${platform}`);
};

[
    //'jQuery', 
    'React', 
    //'Vue', 
    //'Angular'
].forEach((approach) => {
    const demos = getDemoPaths(approach);
    console.log(demos);
    //demos.length = 5;

    demos.forEach((demo) => {
        const testName = demo.replace(/\//g, '-');
        const testParts = demo.split("\/");

        test
            .page`http://127.0.0.1:8080/JSDemos/Demos/${testParts[2]}/${testParts[3]}/${approach}/`
            //.page`file://${path.resolve(demo)}/index.html`
            (testName, async t => {
                const widget = Selector(/*testParts[2].toLowerCase() === 'charts' ? 'svg' :*/ '.dx-widget, svg');

                await t.expect(widget.exists).ok('', { timeout: 30000 });
            });
    });
});