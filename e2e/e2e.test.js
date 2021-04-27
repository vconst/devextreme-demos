import glob from 'glob';
import { compareScreenshot } from './helpers/screenshort-comparer';
import { ClientFunction } from 'testcafe';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

// const waitReadyState = ClientFunction(() => {
//     return new Promise(resolve => {
//         const interval = setInterval(() => {
//             if(window.isReady) {
//                 clearInterval(interval);
//                 resolve();
//             }
//         }, 100);

//         setTimeout(() => {
//             clearInterval(interval);
//             resolve();
//         }, 180000);
//     });
// });

const execCode = ClientFunction(code => {
    const result = eval(code);
    if(result && typeof result.then === 'function') {
        return Promise.race([result, new Promise(resolve => setTimeout(30000, resolve))]);
    } else {
        return Promise.resolve();
    }
});

const execTestCafeCode = async (t, code) => {
    const testCafeFunction = eval(code);
    return await testCafeFunction(t);
}


fixture`Getting Started`
    .beforeEach((t) => t.resizeWindow(1000, 800));

const getDemoPaths = (platform) => {
    return glob.sync(`JSDemos/Demos/**/${platform}`);
};

['jQuery'/*, 'React', 'Vue', 'Angular'*/].forEach((approach) => {
    const demos = getDemoPaths(approach);
    console.log(demos);

    demos.forEach((demo) => {
        const testName = demo.replace(/\//g, '-');
        const testParts = demo.split("\/");
        const widgetName = testParts[2];
        const demoName = testParts[3];
        const testCodePath = join(demo, '../test-code.js');
        const testcafeTestCodePath = join(demo, '../testcafe-test-code.js');

        if(widgetName !== 'TreeList' || demoName !== 'LoadDataOnDemand') {
            // return;
        }
        
        test
            .page`http://127.0.0.1:8080/JSDemos/Demos/${widgetName}/${demoName}/${approach}/`
            //.page`file://${path.resolve(demo)}/index.html`
            (testName, async t => {
                // await waitReadyState();

                if(existsSync(testCodePath)) {
                    const code = readFileSync(testCodePath, 'utf8');
                    await execCode(code);
                }

                if(existsSync(testcafeTestCodePath)) {
                    const code = readFileSync(testcafeTestCodePath, 'utf8');
                    await execTestCafeCode(t, code);
                }

                await t.expect(
                    await compareScreenshot(t,  widgetName + "-" + demoName + ".png")
                ).ok();
            });
    });
});
