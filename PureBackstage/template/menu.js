//全域變數
var subTitle="";

//menu功能點選運作(localHtml版)
function go2work(id){
    location.replace('index.html?id=' + id);
}
function setTitle(title){
    $("#pathTitle").html(title);
}
function setHome(){
    setTitle("首頁");
    let currentQuery = null;
    var mountId = '#qryZone'; //要綁定的div Id
        $(mountId).show();
        const { createApp } = Vue;
        if (currentQuery) {
            currentQuery.unmount();
        }
        const AppComponent = {
            template: `<div style="min-height:75vh;background-image: url('./images/star.png');background-repeat: repeat;">
                <h2>這裡是 Blue Star 後台管理系統首頁</h2>
            </div>
`
        };
        currentQuery = createApp(AppComponent, {
        });
        currentQuery.mount(mountId);
}

// <!--利用API取得目錄清單-->
let currentMenu = null;
//渲染目錄清單
function menuMount(data, msg) {
    var mountId = '#menuSide'; //要綁定的div Id
    const { createApp } = Vue;
    if (currentMenu) {
        currentMenu.unmount();
    }
    const AppComponent = {
        props: ['menu','message'],
        template: `
        <li class="nav-item" v-for="(m, index) in menu">
            <template v-if="m.subItem === null || m.subItem.length===0">
            <a class="go2work nav-link" :data-id="m.demo">
                <i :class="m.icon"></i>
                <span>{{ m.item }}</span>
            </a>
            </template>
            <template v-else>
                <template v-if="m.subItem.length>0">
                <a class="nav-link collapsed" data-toggle="collapse" :data-target="'#'+m.subId" aria-expanded="true" :aria-controls="m.subId">
                    <i :class="m.icon"></i>
                    <span class="menu-title">{{ m.item }}</span>
                </a>
                <div :id="m.subId" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                    <div class="bg-white py-2 collapse-inner rounded">
                    <template v-for="(ms, index) in m.subItem">
                    <a class="go2work collapse-item" :data-id="ms.demo">{{ms.item}}</a>
                    </template>
                    </div>
                </div>
                </template>
            </template>
        </li>
        <div class="text-center">{{message}}</div>`
    };
    currentMenu = createApp(AppComponent, {
        menu:data,
        message: msg
    });
    currentMenu.mount(mountId);
    //綁定事件
    //查詢按鈕
    $("a.go2work").on("click", function (event) {
        go2work($(this).data('id'));
    });
}

let currentUser = null;
function userMount(data){
var mountId = '#userInfo'; //要綁定的div Id
    const { createApp } = Vue;
    if (currentUser) {
        currentUser.unmount();
    }
    const AppComponent = {
        props: ['userInfo','Name'],
        template: `<a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                               <small class="mr-3">自動登出：<span id="expireTime"></span></small> 
                               <span class="mr-2 d-none d-lg-inline text-gray-900 font-weight-bold">{{Name}}</span>
                            </a>
                            <!-- Dropdown - User Information -->
                            <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                 aria-labelledby="userDropdown">
                                <a class="dropdown-item" href="#">
                                    <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Profile
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Settings
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Activity Log
                                </a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Logout
                                </a>
                            </div>
        `
    };
    currentUser = createApp(AppComponent, {
        userInfo:data,
        Name:"TEST"
    });
    currentUser.mount(mountId);
}
//初始化 設定 dataId，引入所需資料檔案
let dId="menu";
try {
    loadScript("./templateData/d_"+dId+".js")
    .then(() => {
        menuMount(d_menu,"");
        userMount();
        //倒數計時
        countdownfunc();
        //處理選單點選後顯示CSS
        let url = location.href;
        //再來用去尋找網址列中是否有資料傳遞(QueryString)
        if(url.indexOf('?')!=-1)
        {
            //之後去分割字串把分割後的字串放進陣列中
            var ary1 = url.split('?');
            //此時ary1裡的內容為：ary1[0] = 'index.html'，ary2[1] = 'id=XXX&name=OOOO'
            //下一步把後方傳遞的每組資料各自分割
            var ary2 = ary1[1].split('&');
            //此時ary2裡的內容為：ary2[0] = 'id=XXX'，ary2[1] = 'name=OOOO'
            //最後如果我們要找id的資料就直接取ary3[0]下手，name的話就是ary3[1]
            var ary3 = ary2[0].split('=');
            //此時ary3裡的內容為：ary3[0] = 'id'，ary3[1] = 'XXX'
            id = ary3[1];   //取得id值
            
            //Sidebar Active Work
            let menuId = '#menuSide';
            var isChosen = false;
            $(menuId+" a.nav-link").each(function () {
                
                var level = $(this).parent();
                if (level.is('li')) {
                    if ($(this).data('id') == id) {
                        level.addClass("active");
                        //isChosen = true;
                    }
                    else
                        level.removeClass("active");
                }
            });
            if (isChosen==false) {
                $(menuId+" li a.collapse-item").each(function () {
                    if ($(this).data('id') === id)
                    {
                        $(this).addClass("active");
                        //利用queryString取得id，展開menu選單
                        var chosenId=$(this).parent("div").parent("div")[0].id;
                        $('#'+chosenId).addClass("show");
                        //選單箭頭，顯示為展開
                        chosenParTagA=$('#'+chosenId).parent("li").find("a")[0];
                        $(chosenParTagA).removeClass("collapsed");
                    }
                    else
                        $(this).removeClass("active");
                });
            }
            //動態顯示資料
            if (["","Home"].includes(id) ){
                setHome();
            }else{
                //reload id.js
                try {
                    loadScript("./template/"+id+".js")
                    .then(() => {
                        // 載入完成後執行的程式
                        //console.log('Script is ready to use.');
                        if (subTitle==undefined){
                            setTitle("");
                        }
                        else
                        {
                            setTitle(subTitle);
                            //console.log("subTitle="+ subTitle);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                    ;
                } catch (error) {
                    console.log(error);
                }
            }
        }
        else
        {
            setHome();
        }
    });
    } catch (error) {
    console.log(error);
}
//倒數計時
    var idle_time = 20;
    var expireTime = idle_time * 60; 
    var countdownnumber = expireTime; //count down 10mins in seconds
    var countdownid = setInterval(countdownfunc, 1000);

    function countdownfunc() {
        if (countdownnumber <= 0) {
            //alert time's up
            //clearInterval(countdownid);
            auth_logout();

        } else if (countdownnumber == 60) {  //剩最後一分鐘時提示
            if (countdownid) {
                clearInterval(countdownid);
            }

            var ret = confirm("時間即將到，是否繼續使用?");
            if (ret) {
                countdownnumber = expireTime;
                var uc = new $.login.UserCollection();

                uc.fetch({
                    async: false,
                    success: function(collection, response, options) {

                        if (response.rtnCode < 0) {
                            alert(response.rtnMsg);
                            // if (response.url)
                            //     window.location.href = response.url;
                            // else
                            //20140409
                                window.location.href = $.config.login_url;
                        }
                    },
                    error: defaultErrorHandler
                });

                countdownid = setInterval(countdownfunc, 1000);
            } else {
                auth_logout();
            }

        } else {

            out = '';
            mins = Math.floor(countdownnumber / 60); //minutes
            secs = Math.floor(countdownnumber % 60); //seconds

            // if (mins < 60)
            //     mins = "0" + mins.toString();
            if (secs < 10)
                secs = "0" + secs.toString();
            out += mins + ":" + secs;

            $("#expireTime").html(out);

            countdownnumber--;
        }
        // return out;
    }