/*設定formui*/
var formui = {
    click2wait: function (items, isWait) {
        var loading = ' <i class="fa fa-spinner fa-spin"></i>';
        for (var i = 0; i < items.length; i++) {
            //var item = $('#' + items[i].id);
            var item = items[i];
            item.prop('disabled', isWait).html((isWait) ? item.html() + loading : item.html().replace(loading, ''));
        }
    },
    showWarning: function (obj, msg, error, classname, isAfter) {
        this.moveWaring();
        classname = (classname == undefined || classname == null) ? "uiError" : classname;
        error = (error == undefined || error == null) ? "" : error;
        var ob = "<div id='iPeaceWaringDiv' class='pt-2 pb-3 text-danger fw-bold " + classname + "'>" + msg + " " + ((error != "") ? "（" + error + "）" : "") + "</div>";
        (isAfter == true) ? obj.after(ob) : obj.before(ob);
    },
    setWarning: function (obj, msg, error) { this.showWarning(obj, msg, error, "uiWarning"); },
    moveWaring: function () { $('body').find("#iPeaceWaringDiv").remove() },
    //xlsDown: function (objId) { $('#datatable_wrapper .datatables-header > div:nth-child(1)').append('<a id="' + objId + '" href="#" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" style="margin:auto;float: right !important;padding: 6px 0 3px 0;"><i class="fa fa-download"></i><span>Excel</span></a>'); },
    xhrErrStr: function (xhr) { return (xhr.readyState == 0) ? "連線失敗" : (xhr.status.toString() + ((xhr.status > 0) ? " - " : "") + xhr.statusText); },
    setErrCls: function (obj, classname) { obj.addClass(classname); setTimeout(function () { obj.removeClass(classname) }, 1500); },
    setWarnFocus: function (obj, msg, isAfter) {
        this.showWarning(obj, msg, "", "uiWarning", isAfter); obj.focus();
        setTimeout(function () { formui.moveWaring(); }, 2000);
    },
    setErrFocus: function (obj, msg, isAfter) {
        this.showWarning(obj, msg, "", "uiError", isAfter); obj.focus();
        setTimeout(function () { formui.moveWaring(); }, 2000);
    },
    goback: function () { window.history.back(); },
    dtTwIni: {
        "language": {
            "sEmptyTable": "目前沒有資料",
            "sInfo": "顯示第 _START_ 至 _END_ 筆結果，共 _TOTAL_ 筆",
            "sInfoEmpty": "顯示第 0 至 0 筆結果，共 0 筆",//"Showing 0 to 0 of 0 _ENTRIES-TOTAL_",
            "sInfoFiltered": "(從 _MAX_ 筆結果中篩選)",//"(filtered from _MAX_ total _ENTRIES-MAX_)",
            "sLengthMenu": "顯示 _MENU_ 筆結果",//"_MENU_ _ENTRIES_ per page",
            "sLoadingRecords": "載入中...",//Loading...",
            "sProcessing": "處理中...",
            "sSearch": "搜尋：",//"Search:",
            "sZeroRecords": "沒有符合的資料",//"No matching records found"
            "sInfoPostFix": "",
            "sUrl": "",
            // "oPaginate": {
            //     first: '第一頁',//'First',
            //     last: '最後一頁',//'Last',
            //     next: '下一頁',//'Next',
            //     previous: '上一頁',//'Previous',
            // },
            // "oPaginate": {
            //     "sFirst": "<<",
            //     "sPrevious": "<",
            //     "sNext": ">",
            //     "sLast": ">>"
            // },
            "oPaginate": {
                "sFirst": "第一頁",
                "sPrevious": "上一頁",
                "sNext": "下一頁",
                "sLast": "最後一頁"
            },
        },
        "lengthMenu": [[10, 20, 50, 100, -1], [10, 20, 50, 100, "全部"]],
        "searching": true,
        "destroy": true,
        "scrollX": true,
        //"dom": '<"top"if>rt<"bottom"lp><"clear">',
        //"ordering": false, 
        //"scrollX": false, 
    }
}

//Simple Modal DIY
var uiModal = {
    modal: $("#uiModal") ,
    open: function () { this.modal.show(); },
    close: function () { this.modal.hide(); }
}

/*
var uiModal = {
    modal: $("#uiModal"),
    closeSpan:$("#uiModal-close"),
    open: function() { this.modal.modal('show'); },
    close: function () { this.modal.modal('hide'); }
}

// When the user clicks on <span> (x), close the modal
uiModal.closeSpan.on("click", function (event) {
    uiModal.close();
});
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == uiModal.modal) {
        uiModal.close();
    }
}
*/