//************控制台设计************

var EventUtil = {

    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },

    getEvent: function(event) {
        return event ? event : window.event;
    },

    getTarget: function(event) {
        return event.target || event.srcElement;
    }

};


window.onload = function() {
    initDataBase();
    initCateList();
    setHighLight(document.querySelector("#catelist").querySelector("h2"));
    initTaskList();

    //处理分类列表栏的点击事件
    EventUtil.addHandler(document.querySelector("#cate-container"), "click", function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);

        if (target.className == "fa fa-close") {
            hideEditTask();
            var sure = confirm("确认要删除它吗？");
            if (sure) {
                if (target.parentNode.tagName.toLowerCase() == "h2") {
                    deleteCate(target);
                } else {
                    deleteSubCate(target);
                }
            }
        } else if (target.tagName.toLowerCase() == "h2" || 
                    target.parentNode.tagName.toLowerCase() == "h2" || 
                    target.tagName.toLowerCase() == "h3" || 
                    target.parentNode.tagName.toLowerCase() == "h3") {
            hideEditTask();
            setHighLight(target);
            initTaskList();
        } else if (target.tagName.toLowerCase() == "div" || target.parentNode.tagName.toLowerCase() == "div") {
            hideEditTask();
            clickAddCate();
        }
    });

    //处理任务列表栏的点击事件
    EventUtil.addHandler(document.querySelector("#task-container"), "click", function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);

        if (target.className == "fa fa-close") {
            hideEditTask();
            var sure = confirm("确认要删除它吗？");
            if (sure) {
                deleteTask(target);
            }
        } else if (target.parentNode.parentNode.tagName.toLowerCase() == "nav") {
            hideEditTask();
            changeStatus(target);
        } else if (target.tagName.toLowerCase() == "h4" || target.parentNode.tagName.toLowerCase() == "h4") {
            hideEditTask();
            setHighLight(target);
            var targetTaskID = getTargetTaskId(target);
            showTaskData(targetTaskID);
        } else if (target.tagName.toLowerCase() == "div" || target.parentNode.tagName.toLowerCase() == "div") {
            clickAddTask();
        }
    });

    //处理Mask中的点击事件
    EventUtil.addHandler(document.querySelector("#mask"), "click", function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event); 

        if (target.id == "yeah") {
            var cateName = document.querySelector("#selectCate").value;
            var newCateName = document.querySelector("#newCateName").value;

            if (!newCateName) {
                alert("新分类名称不能为空！")
            } else if (cateName == -1) {
                addNewCate(newCateName);
            } else {
                addNewSubCate(cateName, newCateName);
            }
        } else if (target.id == "nope") {
            hideMask();
        }
    });

    //处理右侧展示任务中的点击事件
    EventUtil.addHandler(document.querySelector("#data-display"), "click", function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);

        if (target.className == "fa fa-check-square-o") {
            var sure = confirm("确定嘛？任务标记完成之后就回不去啦！");
            if (sure) {
                finishTask();
            }
        } else if (target.className == "fa fa-pencil-square-o") {
            showEditTask();
            showOrigTaskData();

            //更换按钮为“保存修改任务”
            document.querySelector("#save-cancle").querySelector("button").id = "changeit";
        }
    });

    //处理右侧编辑任务中的点击事件
    EventUtil.addHandler(document.querySelector("#data-edit"), "click", function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);

        if (target.id == "saveit") {
            var check = checkDataValidation();

            var activeCate = document.querySelector("#cate-container").querySelector(".active");
            var curSubCateID = activeCate.parentNode.getAttribute("data-subCateID");

            if (check.valid) {
                addNewTask(curSubCateID, check);
            }
        } else if (target.id == "changeit") {
            updateTask();
        } else if (target.id == "cancleit") {
            hideEditTask();
        }
    });

}