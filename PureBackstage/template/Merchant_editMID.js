    //***********************
    //**    GLOBAL變數     **
    //***********************
    subTitle="商家維護";

    //***********************
    //** 查詢區域 Vue 綁定  **
    //***********************
    let qry_isActive = [
        { "val": -1, vName: "全部"},
        { "val": 1, vName: "是", check: true },
        { "val": 0, vName: "否" }
    ]
    let qryCols = [
        { "id": "MerchantId", "name": "特店代號", "type": "input"},
        { "id": "isActive", "name": "是否啟用", "type": "radio", "vals": qry_isActive }
    ];
    let currentQuery = null; //初始化物件，避免二次綁定時失敗
    function queryMount() {
        var mountId = '#qryZone'; //要綁定的div Id
        $(mountId).show();
        const { createApp } = Vue;
        if (currentQuery) {
            currentQuery.unmount();
        }
        const AppComponent = {
            props: ['cols'],
            template: `<div class="qryArea">
            <div class="row form-inline" v-for="(c,index) in cols">
                <template v-if="c.type == 'radio'">
                    <label class="col-xl-1 col-sm-2 myrow">{{c.name}}：</label>
                    <div class='col-xl-11 col-sm-10 input-group radioGroup' v-bind:id="c.id">
                        <template v-for="(r,index) in c.vals">
                          <input type="radio" v-bind:id="c.id+'_'+r.val" v-bind:name="c.id" v-bind:value="r.val" v-bind:checked=r.check />
                          <label v-bind:for="c.id+'_'+r.val">{{r.vName}}</label>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <label v-bind:for="c.id" class="col-xl-1 col-sm-2 myrow">{{c.name}}：</label>
                    <div class='col-xl-11 col-sm-10 input-group' >
                        <input v-bind:id="c.id" type='text' class='width-25'/>
                    </div>
                </template>
            </div>
            <div class="row">
                <div class="col-xl-1 col-sm-2"> </div>
                <div class='col-xl-11 col-sm-10 form-group align-middle btnZone'>
                    <button id="btn_clear" class="btn btn-warning "><i></i>清除</button>
                    <button id="btn_add" class="btn btn-danger ml-3 mr-3"><i class="glyphicon glyphicon-plus"></i>新增</button>
                    <button id="btn_qry" class="btn btn-info"><i class="glyphicon glyphicon-search"></i>查詢</button>
                </div>
            </div>
            </div>`
        };
        currentQuery = createApp(AppComponent, {
            cols: qryCols
        });
        currentQuery.mount(mountId);
        //
        $("#MerchantId").focus();
        //清除按鈕
        $("#btn_clear").on("click", function (event) {
            $("#MerchantId").val("");
            $('#dataZone').hide();
            formui.moveWaring();
        });
        //查詢按鈕
        $("#btn_qry").on("click", function (event) {
            $('#dataZone').hide();
            /*
            try {
                var val_mid = $("#MerchantId").val();
                var val_isActive = $("input[name=isActive]:checked").val();
                var reqdata = { mid: val_mid, isactive: val_isActive };
                $.ajax({
                    method: "GET", data: reqdata, async: false,
                    url: "../../api/getMerchant"
                }).done(function (ret) {
                    if (ret.rtnCode == 0) {
                        dataMount(ret.datas);
                        //generate table
                        $('#mypassTable').DataTable(formui.dtTwIni);
                        $('#dataZone').show();
                    }
                    else {
                        formui.setWarning($('#myPassMemo'), "取得資料發生錯誤", ret.rtnCode + "：" + ret.rtnMsg);
                    }
                }).fail(function () {
                    formui.setWarning($('#myPassMemo'), "取得資料發生錯誤", "");
                });
               
            } catch (e) {
                console.log(e);
                formui.setWarning($('#myPassMemo'), "取得資料發生錯誤ex", "");
            }
            */
           let  dataJsId = "d_Merchant_qryMID";
                try {
                    loadScript("./templateData/"+dataJsId+".js")
                    .then(() => {
                        // 載入完成後執行的程式
                        dataMount(d_qryData);
                        //generate table
                        $('#mypassTable').DataTable(formui.dtTwIni);
                        $('#dataZone').show();
                    })
                    .catch((error) => {
                        console.error(error);
                        formui.setWarning($('#myPassMemo'), "取得資料發生錯誤", error);
                    });
                    ;
                } catch (error) {
                    console.log(error);
                    formui.setWarning($('#myPassMemo'), "取得資料發生錯誤ex", error);
                }
        });
        //新增按鈕
        $("#btn_add").on("click", function (event) {
            editMount();
            uiModal.open();
        });

        //***********************
        //**    其他功能區      **
        //***********************
        //經營模式radio
        $("input[name=FranchiseModel],input[name=Enable]").on("click", function (event) {
            $('#dataZone').hide();
            formui.moveWaring();
        });
    }

    //***********************
    //** 查詢資料 Vue 綁定  **
    //***********************
    let reportCols = ["序號","特店代號", "特店名稱", "是否啟用",  "最後異動時間",  ""];  //顯示欄位
    let reportName = "商家名單";   //資料Title
    let reportApp = null; //初始化物件，避免二次綁定時失敗
    function dataMount(result) {
        var mountId = '#dataResult'; //要綁定的div Id
        const { createApp } = Vue;
        if (reportApp) {
            reportApp.unmount();
        }
        const AppComponent = {
            props: ['report', 'data', 'cols'],
            template: `
            <div class='myPassTBHead'>{{ report }}</div>
    <table id="mypassTable" class="table table-striped table-bordered display">
        <thead>
            <tr>
                <th v-for="(c,index) in cols">{{c}}</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="(m, index) in data.SubStore">
            <template v-if="m.myMerchantId != null && m.myMerchantId.length>0">
                <tr>
                    <td>{{m.RankNo}}</td>
                    <td>{{m.myMerchantId}}</td>
                    <td>{{m.myStoreName}}</td>
                    <td>{{m.myActive}}</td>
                    <td>{{m.myCreateTime}}</td>
                    <td>
                        <a class="btn-info btn btn-app btn-xs editMID" v-bind:data-mid='m.MerchantId'><i class="glyphicon glyphicon-edit"></i>編輯</a>
                    </td>
                </tr>
            </template>
            </template>
        </tbody>
    </table>
            `
        };
        reportApp = createApp(AppComponent, {
            report: reportName,
            cols: reportCols,
            data: result
        });
        reportApp.mount(mountId);
        //ReRender ReBind
        $(".editMID").on("click", function (event) {
            var mid = $(this).data("mid");
            $.ajax({
                method: "GET",
                url: "../../api/getCTBCMerchant",
                data: { mid: mid, model: null },
                async: false,
            }).done(function (ret) {
                editMount(ret.datas);
                uiModal.open();
            }).fail(function () {
                formui.setWarning($('#myPassMemo'), "取得資料發生錯誤", "")
            });
        });
    }
    //***********************
    //** 編輯頁面 Vue 綁定  **
    //***********************
    let edit_isActive = [{ "val": 0, vName: "關閉" }, { "val": 1, vName: "啟用" }];
    let editCols = [
        { "id": "mod_MerchantId", "name": "特店代號", "type": "input" },
        { "id": "mod_StoreName", "name": "特店名稱", "type": "input" },
        { "id": "mod_isActivr", "name": "是否啟用", "type": "radio", "vals": edit_isActive },
    ];
    let editTitle = "商家名單維護";
    let currentEdit = null; //初始化物件，避免二次綁定時失敗
    function editMount(result) {
        var mountId = '#uiModal'; //要綁定的div Id
        const { createApp } = Vue;
        if (currentEdit) {
            currentEdit.unmount();
        }
        const AppComponent = {
            props: ['title', 'data', 'cols'],
            template: `    <div class="uiModal-content width-60">
      <div class="uiModal-header">
        <span id="uiModal-close" class="uiModal-close">&times;</span>
        <h4>{{title}}</h4>
      </div>
      <div class="uiModal-body">
        <form class="">
            <div class="qryArea">
                <div class="row mt-2" v-for="(c,index) in cols">
                    <template v-if="c.type == 'radio'">
                        <label class="col-sm-2 myrow">{{c.name}}：</label>
                        <div class='col-sm-10 input-group radioGroup' v-bind:id="c.id">
                            <template v-for="(r,index) in c.vals">
                              <input type="radio" v-bind:id="c.id+'_'+r.val" v-bind:name="c.id" v-bind:value="r.val" />
                              <label v-bind:for="c.id+'_'+r.val">{{r.vName}}</label>
                            </template>
                        </div>
                    </template>
                    <template v-else-if="c.type == 'label'">
                        <label class="col-sm-2 myrow">{{c.name}}：</label>
                        <label v-bind:id="c.id" class="col-sm-10"></label>
                    </template>
                    <template v-else>
                        <label v-bind:for="c.id" class="col-sm-2 myrow">{{c.name}}：</label>
                        <div class='col-sm-10 input-group' >
                            <input v-bind:id="c.id" type='text' class="width-25"/>
                        </div>
                    </template>
                </div>
                <div class="row">
                    <div class="col-sm-2"></div>
                    <div class="col-sm-10 btnZone">
                        <a id="btn_mod_OK" class="btn btn-info ">確認</a>
                        <a id="btn_mod_NG" class="btn btn-warning ml-3">取消</a>
                    </div>
                </div>
                <div id='myPassModMemo'></div>
            </div>
        </form>
      </div>
    </div>`
        };
        currentEdit = createApp(AppComponent, {
            title: editTitle,
            data: result,
            cols: editCols
        });
        currentEdit.mount(mountId);
        /* Binding Edit Data */
        if (result != undefined) {
            //鎖定不可編輯
            $("#mod_MerchantId").attr("disabled", true);
            //給值
            $("#mod_MerchantId").val(result[0].MerchantId);
            $("#mod_StoreName").val(result[0].StoreName);
            $('input:radio[name="mod_isActive"][value="' + ((result[0].Enable) ? 1 : 0) + '"]').prop('checked', true);
        }
        //ReRender ReBind
        $("#btn_mod_OK").on("click", function (event) {
            //依編輯欄位進行檢核
            for (var i = 0; i < editCols.length; i++) {
                var id = editCols[i].id;
                var v = "";
                if (editCols[i].check != 0) { 
                    if (editCols[i].type == "radio") {
                        v = $("input[name=" + id + "]:checked").val();
                        if (v == undefined) {
                            formui.setErrFocus($("#" + id), "請選擇項目", false);
                            return false;
                        }
                    } else {
                        v = $("#" + id).val();
                        if (v == "") {
                            formui.setErrFocus($("#" + id), "請輸入資料", true);
                            return false;
                        }
                    }
                }
            }
            //準備上送資料
            $.ajax({
                method: "POST",
                url: "../../api/updateMerchant",
                data: {
                    MerchantId: $("#mod_MerchantId").val(),
                    StoreName: $("#mod_StoreName").val(),
                    isActive: $("input[name=mod_isActive]:checked").val() == "1" ? true : false,
                },
                async: false,
            })
                .done(function (ret) {
                    if (ret.rtnCode == 0) {
                        //1.關MODAL
                        uiModal.close();
                        //2.顯示SWEET ALERT
                        Swal.fire("資料新增/修改成功", "", "success")
                            .then(() => {
                                //3.新增時，將查詢條件MerchantId設定為新增的MID
                                if (result == undefined)
                                    $("#MerchantId").val($("#mod_MerchantId").val());
                                //3.重新查詢
                                btn_qry.click();
                            });
                    }
                    else {
                        formui.setWarning($('#myPassModMemo'), "資料更新失敗", ret.rtnCode + "：" + ret.rtnMsg);
                    }
                })
                .fail(function () {
                    formui.setWarning($('#myPassModMemo'), "資料更新發生錯誤", "");
                });
        });
        $("#uiModal-close,#btn_mod_NG").on("click", function (event) {
            uiModal.close();
        });
    }

    //***********************
    //**    一般功能區      **
    //***********************
    //初始化
    queryMount();
