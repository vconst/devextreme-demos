import glob from 'glob';
import { compareScreenshot } from './helpers/screenshort-comparer';

fixture`Getting Started`
    .beforeEach((t) => t.resizeWindow(800, 600));

const getDemoPaths = (platform) => {
    return glob.sync(`JSDemos/Demos/DataGrid/**/${platform}`);
};

['jQuery', 'React', 'Vue', 'Angular'].forEach((approach) => {
    const demos = getDemoPaths(approach);
    console.log(demos);
    // demos.length = 5;

    demos.forEach((demo) => {
        const testName = demo.replace(/\//g, '-') + '-' + approach;
        const testParts = demo.split("\/");
        
        test
            .page`http://127.0.0.1:8080/JSDemos/Demos/${testParts[2]}/${testParts[3]}/${approach}/`
            //.page`file://${path.resolve(demo)}/index.html`
            (testName, async t => {
                await compareScreenshot(t,  testParts[2] + "-" + testParts[3] + ".png");
            });
    });
});
