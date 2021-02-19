import glob from 'glob';
import fs from 'fs';

//import { EOL } from 'os';
// const EOL = '\n';

const getDemoPaths = (platform) => {
    return glob.sync(`JSDemos/Demos/**/${platform}`);
};

const angularPackageConfigPaths = [
    "npm:devextreme/ui/*/package.json",
    "npm:devextreme/events/package.json",
    "npm:devextreme/core/utils/common/package.json",
    "npm:devextreme/core/utils/callbacks/package.json",
    "npm:devextreme/core/dom_adapter/package.json",
    "npm:devextreme/package.json"
];

const packageConfigPaths = [
    "npm:devextreme/viz/*/package.json",
    "npm:devextreme/viz/export/package.json",
    "npm:devextreme/core/*/package.json",
    "npm:devextreme/data/*/package.json",
    "npm:devextreme/data/odata/*/package.json",
    "npm:devextreme/core/utils/*/package.json",
    "npm:devextreme/events/*/package.json",
    "npm:devextreme/events/utils/package.json",
    "npm:devextreme/events/package.json",
    "npm:devextreme/ui/*/package.json",
    "npm:devextreme/localization/package.json",
    "npm:devextreme/localization/*/package.json",
    "npm:devextreme/excel_exporter/package.json",
    "npm:devextreme/pdf_exporter/package.json",
    "npm:devextreme/file_management/*/package.json",
    "npm:devextreme/ui/speed_dial_action/*/package.json",
    "npm:devextreme/ui/html_editor/*/package.json",
    "npm:devextreme/ui/html_editor/converters/*/package.json",
    "npm:devextreme/localization/globalize/number/package.json",
    "npm:devextreme/localization/globalize/date/package.json",
    "npm:devextreme/localization/globalize/currency/package.json",
    "npm:devextreme/localization/globalize/message/package.json",
    "npm:devextreme/ui/pivot_grid/*/package.json",
];

[
    // 'jQuery', 
     'React', 
    // 'Vue', 
    // 'Angular'
].forEach((approach) => {
    const demos = getDemoPaths(approach);
    //console.log(demos);
    //demos.length = 3;
    const padding = approach === 'Angular' ? '    ' : '  ';

    demos.forEach((demo) => {
        const path = demo + '/config.js';
        if(!fs.existsSync(path)) return;
        console.log(demo);
        let content = fs.readFileSync(path, { encoding: 'utf-8' });
        const EOL = content.indexOf('\r\n') >= 0 ? '\r\n' : '\r';
        const pathsIndex = content.indexOf(',' + EOL + padding + 'packageConfigPaths');
        const removePrev = pathsIndex >= 0;
        if(removePrev) {
            const pathsEndIndex = content.indexOf('}', pathsIndex + 1);
            content = content.slice(0, pathsIndex) + EOL + content.slice(pathsEndIndex);
            console.log('removed');
        }
        const insertIndex = content.indexOf(EOL + '})');
        if(insertIndex > 0) {
            const paths = approach === 'Angular' ? angularPackageConfigPaths.concat(packageConfigPaths) : packageConfigPaths;
            const pathsText = paths.map(p => `${padding}${padding}'${p}'`).join(',' + EOL);
            const insertText = `,${EOL}${padding}packageConfigPaths: [${EOL}${pathsText}${EOL}${padding}]`;
            content = content.slice(0, insertIndex) + insertText + content.slice(insertIndex);
            console.log('inserted');
        }
        fs.writeFileSync(path, content, {encoding: 'utf-8'});
    });
});