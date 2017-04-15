//全局变量
var apiBaseUrl = '/api';

$(function () {
    //初始化共公界面元素
    initPublicElement();
    //初始化界面
    initPage();
});

//初始化共公界面元素
function initPublicElement() {
    //初始化pace进度条
    $(document).ajaxStart(function () {
        Pace.restart();
    });

    //初始化左侧菜单选中样式
    var activeMenu = $(".sidebar-menu a[href*='" + getPageName() + "']:first").parent();
    if (activeMenu.length > 0) {
        do {
            activeMenu.addClass("active")
            activeMenu = activeMenu.parent();
        } while (!activeMenu.hasClass("sidebar-menu"));
    }
}

//获取URL文件名
function getPageName() {
    var url = window.location.href.split("?")[0];
    var urlSlashCount = url.split('/').length;
    pageName = url.split('/')[urlSlashCount - 1].toLowerCase();
    console.debug(pageName);
    return pageName;
}

//显示模态窗口
function showModalAlert(msg, callback, type) {
    var btnYes = $("#alert-modal .modal-footer button.btn-yes");
    var btnNo = $("#alert-modal .modal-footer button.btn-no");
    $("#alert-modal .modal-body").empty().append(msg);

    if (callback != null) {
        btnYes.unbind("click").click(function () {
            callback();
        });
    } else {
        btnYes.unbind("click");
    }

    //设置样式
    $("#alert-modal").removeClass("modal-danger modal-success modal-warning modal-info modal-primary");
    if (type == null || type == "alert") {
        btnNo.addClass("hidden");
    } else {
        btnNo.removeClass("hidden");
        $("#alert-modal").addClass("modal-" + type);
    }

    $("#alert-modal").modal({backdrop: 'static', keyboard: false});
    $(".modal-backdrop").hide();
}

//REST请求模板
function restTemplate(httpMethod, svcName, jsInObj, callback) {
    accessToken = sessionStorage.getItem("accessToken")
    if (httpMethod == "POST" || httpMethod == "PUT") {
        jsInObj = JSON.stringify(jsInObj);
    }
    $.ajax({
        type: httpMethod,
        url: apiBaseUrl + svcName,
        data: jsInObj,
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        headers: {"Authorization": "JWT " + accessToken},
        beforeSend: function () {
        },
        success: function (jsOutObj) {
            callback(jsOutObj);
        },
        complete: function (XMLHttpRequest, textStatus) {
        },
        error: function (jqXHR) {
            var status = jqXHR.status;
            console.debug(status);

            if (status < 200 || status > 299) {
                var message = jqXHR.responseJSON.errinfo;
                var alertMsg = message == null ? "未知错误，请重试" : message;
                showModalAlert(alertMsg);
            }

        }
    });

}
