(function(factory) {
    if (window.Promise && window.System) {
        Promise.all([
            System.import("devextreme/ui/gantt")
        ]).then(function (args) {
            factory(args[0]);
        });
    } else {
        factory(DevExpress.ui.dxGantt);
    }
})(function(dxDateBox) {
    $("#gantt").each(function (_, item) {
        var instance = dxDateBox.getInstance(item);
        instance.option("stripLines[2].start", new Date(2000, 3, 1, 0, 0, 0, 0));
    });
});
