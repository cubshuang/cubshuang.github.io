    //***********************
    //**    GLOBAL變數     **
    //***********************
    subTitle="商店資訊查詢";

    //***********************
    //** 查詢區域 Vue 綁定  **
    //***********************
    let qryCols = [
        { "id": "MerchantId", "name": "特店代號", "type": "input"},
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
            template: `
            <div class="mb-2">
            <div class="row form-inline" v-for="(c,index) in cols">
                    <label v-bind:for="c.id" class="col-sm-1 justify-content-end">{{c.name}}：</label>
                    <div class='col-sm-11' >
                        <input v-bind:id="c.id" type='text'/>
                    </div>
            </div>
            <div class="row">
                <div class="col-sm-1"></div>
                <div class='col-sm-11 form-group align-middle btnZone'>
                    <button id="btn_clear" class="btn btn-warning "><i></i>清除</button>
                    <button id="btn_qry" class="btn btn-info ml-3"><i class="glyphicon glyphicon-search"></i>查詢</button>
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
            //檢核資料
            // let v = $("#MerchantId").val();
            // if (v == "") {
            //     formui.setErrFocus($("#MerchantId"), "請輸入資料", true);
            //     return false;
            // }
            //匯入資料
            //reload id.js
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
    }

    //***********************
    //** 查詢資料 Vue 綁定  **
    //***********************
    let reportCols = ["RankNo", "myMerchantId", "myStoreName", "myActive", "myCreateTime"];  //顯示欄位
    let reportName = "商家清單";   //資料Title
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
                    <td>{{m.myCreateTime}}
                    </td>
                </tr>
            </template>
            </template>
        </tbody>
    </table>`
        };
        reportApp = createApp(AppComponent, {
            report: reportName,
            cols: reportCols,
            data: result
        });
        reportApp.mount(mountId);

        console.log(result);
        console.log(result.SubStore);
    }

    //***********************
    //**    一般功能區      **
    //***********************
    //初始化
    queryMount();
