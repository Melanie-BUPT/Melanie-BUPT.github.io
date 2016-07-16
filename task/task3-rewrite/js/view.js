//************应用界面设计************

//为元素设置高亮显示
function setHighLight(element) {
    var eleTag = element.tagName.toLowerCase();
    var parTag = element.parentNode.tagName.toLowerCase();

    if (eleTag == "h4" || parTag == "h4") {
        var taskList = document.querySelectorAll("h4");
        for (var i = 0; i < taskList.length; i++) {
            taskList[i].className = "";
        }
    } else {
        var cateList = document.querySelectorAll("h2");
        for (var i = 0; i < cateList.length; i++) {
            cateList[i].className = "";
        }
        var subCateList = document.querySelectorAll("h3");
        for (var i = 0; i < subCateList.length; i++) {
            subCateList[i].className = "";
        }
    }

    if (eleTag == "h2" || eleTag == "h3" || eleTag == "h4") {
        element.className = "active";
    } else {
        element.parentNode.className = "active";
    }
}

//新增分类显示Mask
function showMask() {
    document.querySelector("#mask").style.display = "block";
}

//确认或取消新增分类隐藏Mask
function hideMask() {
    document.querySelector("#mask").style.display = "none";
}

//改变任务列表导航栏的状态
function changeStatus(element) {
    var navBar = document.querySelector("nav");
    var statusList = navBar.querySelectorAll("li");
    for (var i = 0; i < statusList.length; i++) {
        statusList[i].className = "";
    }
    element.className = "active";

    //获取当前任务数组
    var taskList = getCurTaskList();
    var statusID = element.id;
    if (statusID == "alltasks") {
        initTaskList();
    } else if (statusID == "unfinished") {
        var unfinishedList = [];
        for (var i = 0; i < taskList.length; i++) {
            if (!taskList[i].finish) {
                unfinishedList.push(taskList[i]);
            }
        }
        initTaskList(unfinishedList);
    } else {
        var finishedList = [];
        for (var i = 0; i < taskList.length; i++) {
            if (taskList[i].finish) {
                finishedList.push(taskList[i]);
            }
        }
        initTaskList(finishedList);
    }
}

//右侧界面显示任务详情
function showTaskData(id) {
    var dataDisplay = document.querySelector("#data-display");
    var taskTitle = dataDisplay.querySelector(".task-title").querySelector("span");
    var taskDate = dataDisplay.querySelector(".task-date").querySelector("span");
    var taskContent = dataDisplay.querySelector(".task-content");
    var manipulate = dataDisplay.querySelector("#manipulate");

    if (id != -1) {
        var targetTask = getTaskById(id);

        taskTitle.innerHTML = targetTask.name;
        taskDate.innerHTML = targetTask.date;

        var content = targetTask.content;
        if (content.indexOf("\n") != -1) {
            var result = "";
            var tempContent = content.split("\n");
            for (var i = 0; i < tempContent.length; i++) {
                result += tempContent[i] + "<br>";
            }
            taskContent.innerHTML = result;
        } else {
            taskContent.innerHTML = content;
        }

        if (targetTask.finish) {
            manipulate.style.display = "none";
        } else {
            manipulate.style.display = "inline-block";
        }
    } else {
        taskTitle.innerHTML = "";
        taskDate.innerHTML = "";
        taskContent.innerHTML = "";
        manipulate.style.display = "none";
    }
}

//新增或编辑任务显示编辑页面
function showEditTask() {
    document.querySelector("#data-display").style.display = "none";
    document.querySelector("#data-edit").style.display = "block";
}

//完成或取消编辑任务隐藏编辑页面
function hideEditTask() {
    document.querySelector("#data-display").style.display = "block";
    document.querySelector("#data-edit").style.display = "none";

    //清空编辑栏中的信息
    document.querySelector("#input-title").value = "";
    document.querySelector("#input-date").value = "";
    document.querySelector("#input-content").value = "";
}

//点击编辑任务时显示原始任务数据
function showOrigTaskData() {
    var targetTaskID = getTargetTaskId(document.querySelector("h4.active"));
    var targetTask = getTaskById(targetTaskID);

    document.querySelector("#input-title").value = targetTask.name;
    document.querySelector("#input-date").value = targetTask.date;
    document.querySelector("#input-content").value = targetTask.content;
}