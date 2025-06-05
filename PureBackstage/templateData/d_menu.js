// demo參數為該筆交易要引入的該參數的js檔(ex.Merchant_report.js)，功能的操作都在此js執行。
//相關js檔的測試資料可放於本data.js檔中提供執行，模擬由api取得資料
let d_menu=[
    {
        "item": "首頁",
        "icon": "fa fa-home",
        "url": "/",
        "demo": "Home",
        "subId": "",
        "subItem": []
    },
    {
        "item": "商家資訊",
        "icon": "fas fa-fw fa-cog",
        "url": "",
        "subId": "Merchant",
         "subItem": [
            {
                "item": "商家查詢",
                "url": "/Merchant/qryMID",
                "demo": "Merchant_qryMID",
            },
            {
                "item": "商家報表查詢",
                "url": "/Merchant/report",
                "demo": "Merchant_report",
            }
        ]
    },
    {
        "item": "其他",
        "icon": "fas fa-fw fa-cog",
        "url": "",
        "subId": "Other",
         "subItem": [
            {
                "item": "商家維護",
                "url": "/Ｍerchant/editMID",
                "demo": "Merchant_editMID",
            }
        ]
    }
];

