    //***********************
    //**    GLOBAL變數     **
    //***********************
    subTitle="商店報表查詢";

    //***********************
    //** 查詢區域 Vue 綁定  **
    //***********************
    let qryCols = [
        { "id": "MerchantId", "name": "特店代號", "type": "input"},
        { "id": "DateStart", "name": "報表起日", "type": "date"},
        { "id": "DateEnd", "name": "報表迄日", "type": "date"},
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
            <div class="row form-inline mb-3">
                <label for="MerchantId" class="col-sm-1 justify-content-end">特店代號：</label>
                <div class='col-sm-11' >
                    <input id="MerchantId" type='text' style="width:15%"/>
                </div>
            </div>
            <div class="row form-inline mb-2">
                    <label class="col-sm-1 justify-content-end">報表區間：</label>
                    <div class='col-sm-11' >
                        <input id="DateStart" type='date' style="width:15%" /> ~
                        <input id="DateEnd" type='date'  style="width:15%" />
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
            let  dataJsId = "d_Merchant_report";
            try {
                loadScript("./templateData/"+dataJsId+".js")
                .then(() => {
                    // 載入完成後執行的程式
                    dataMount(d_qryData);
                    //generate table
                    //$('#mypassTable').DataTable(formui.dtTwIni);

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
        //initial
        $('#MerchantId').val('Bear001');
        $('#DateStart').val(bsDate.LastMonth_Begin().replace('/','-').replace('/','-'));
        $('#DateEnd').val(bsDate.LastMonth_End().replace('/','-').replace('/','-'));
    }

    //***********************
    //** 查詢資料 Vue 綁定  **
    //***********************
    let reportApp = null; //初始化物件，避免二次綁定時失敗
    function dataMount(result) {
        var mountId = '#dataResult'; //要綁定的div Id
        const { createApp } = Vue;
        if (reportApp) {
            reportApp.unmount();
        }
        const AppComponent = {
            // props: ['report', 'data', 'cols'],
            template: `
            <div class="card shadow mb-4">
                <!-- Card Header - Dropdown -->
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Earnings Overview</h6>
                </div>
                <!-- Card Body -->
                <div class="card-body">
                    <div class="chart-area">
                        <canvas id="myChart"></canvas>
                    </div>
                </div>
            </div>`
        };
        reportApp = createApp(AppComponent, {
            // report: reportName,
            // cols: reportCols,
            // data: result
        });
        reportApp.mount(mountId);
        //
        const ctx = document.getElementById('myChart');
        new Chart(ctx, {
            type: 'bar',
            data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '銷售量',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
            },
            options: {
            scales: {
                y: {
                beginAtZero: true
                }
            }
            }
        });
    }

    //***********************
    //**    一般功能區      **
    //***********************
    //初始化
    queryMount();
    

