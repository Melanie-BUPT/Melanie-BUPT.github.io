//************数据库设计************

/**
 *
 * 使用数据库的思想，构建3张表。
 * cateJson 主分类
 * subCateJson 子分类
 * taskJson 任务
 *
 * 主分类表 cateJson
 * -----------------------
 * id* | name | child(arr)
 * -----------------------
 *
 * 子分类表 subCateJson
 * -----------------------------
 * id* | pid | name | child(arr)
 * -----------------------------
 *
 * 任务表 taskJson
 * ------------------------------------------
 * id* | pid | finish | name | date | content
 * ------------------------------------------
 */

//*********初始化数据库*********
function initDataBase() {
    /*if (/MSIE ([^;]+)/.test(navigator.userAgent)) {
        var localStorage = {};
        localStorage.cate = [];
        localStorage.subCate = [];
        localStorage.task = [];
    }*/
    if (!localStorage.cate || !localStorage.subCate || !localStorage.task) {

        var cateJson = [
            {
                "id": 0,
                "name": "默认分类",
                "child": [0]
            }
        ];

        var subCateJson = [
            {
                "id": 0,
                "pid": 0,
                "name": "默认子分类",
                "child": [0]
            }
        ];

        var taskJson = [
            {
                "id": 0,
                "pid": 0,
                "finish": true,
                "name": "使用说明",
                "date": "2015-10-28",
                "content": "最左侧为任务分类列表，支持查看所有任务或者查看某个分类下的所有任务。分类名称后显示的是当前分类中未完成任务的数量。点击新增分类可以为列表新增分类或子分类。不能为默认分类添加子分类。<br>中间列为任务列表。可以根据状态选项选择显示全部或部分任务。点击新增任务可以为列表新增任务。<br>最右侧为任务详情。点击\"编辑按钮\"<span class=\"fa fa-pencil-square-o\"></span>可以对任务进行编辑，点击\"完成按钮\"<span class=\"fa fa-check-square-o\"></span>可以将任务设置为完成。完成后的任务不能再编辑。<br>"
            }
        ];

        localStorage.cate = JSON.stringify(cateJson);
        localStorage.subCate = JSON.stringify(subCateJson);
        localStorage.task = JSON.stringify(taskJson);
    }
}

//获取所有主分类
function getAllCates() {
    return JSON.parse(localStorage.cate);
}

//获取所有子分类
function getAllSubCates() {
    return JSON.parse(localStorage.subCate);
}

//获取所有任务
function getAllTasks() {
    return JSON.parse(localStorage.task);
}

//*********初始化分类列表*********
function initCateList() {
    var cateJson = getAllCates();
    var subCateJson = getAllSubCates();
    var ulStr = "";

    for (var i = 0; i < cateJson.length; i++) {
        var liStr = "";

        if (cateJson[i].child.length == 0) {
            liStr = '<li class="cate" data-cateID="' + cateJson[i].id + '"><h2><span class="fa fa-folder-open"></span>'
                    + cateJson[i].name + '<span class="taskNum">(0)</span><span class="fa fa-close"></span></h2></li>';
        } else {
            if (i == 0) {
                liStr = '<li class="cate" data-cateID ="0"><h2><span class="fa fa-folder-open"></span>'
                        + cateJson[i].name + '<span class="taskNum">(' + getTaskNumByCate(cateJson[0]) + ')</span></h2>'
                        + '<ul><li class="subCate" data-subCateID="0"><h3><span class="fa fa-file-o"></span>' 
                        + subCateJson[0].name + '<span class="taskNum">(' + getTaskNumBySubCate(subCateJson[0]) 
                        + ')</span></h3></li></ul></li>'; 
            } else {
                liStr = '<li class="cate" data-cateID="' + cateJson[i].id 
                    + '"><h2><span class="fa fa-folder-open"></span>' + cateJson[i].name
                    + '<span class="taskNum">(' + getTaskNumByCate(cateJson[i]) 
                        + ')</span><span class="fa fa-close"></span></h2><ul>';
                for (var j = 0; j < cateJson[i].child.length; j++) {
                    var subCateID = cateJson[i].child[j];
                    liStr += '<li class="subCate" data-subCateID="' + subCateID
                            + '"><h3><span class="fa fa-file-o"></span>' + getSubCateById(subCateID).name
                            + '<span class="taskNum">(' + getTaskNumBySubCate(getSubCateById(subCateID))
                            + ')</span><span class="fa fa-close"></span></h3></li>'
                }
                liStr += '</ul></li>';
            }
        }
        ulStr += liStr;
    }
    document.querySelector("#catelist").innerHTML = ulStr;
    document.querySelector("#allTaskNum").innerHTML = "(" + getAllTaskNum() + ")";
    setHighLight(document.querySelector("#allTaskNum"));
}

//获取主分类下未完成任务数
function getTaskNumByCate(cate) {
    var result = 0;

    if (cate.child.length !== 0) {
        for (var i = 0; i < cate.child.length; i++) {
            var curSubCate = getSubCateById(cate.child[i]);
            if (curSubCate.child.length !== 0) {
                for (var j = 0; j < curSubCate.child.length; j++) {
                    var curTask = getTaskById(curSubCate.child[j]);
                    if (!curTask.finish) {
                        result ++;
                    }
                }
            }
        }
    }
    return result;
}

//获取子分类下未完成任务数
function getTaskNumBySubCate(subCate) {
    var result = 0;

    if (subCate.child.length !== 0){
        for (var i = 0; i < subCate.child.length; i++) {
            var curTask = getTaskById(subCate.child[i]);
            if (!curTask.finish) {
                result ++;
            }
        }
    }
    return result;
}

//获取所有未完成的任务数
function getAllTaskNum() {
    var result = 0;
    var taskJson = getAllTasks();

    for (var i = 0; i < taskJson.length; i++) {
        if (!taskJson[i].finish) {
            result ++;
        }
    }
    return result;
}

//点击新增分类显示Mask
function clickAddCate() {
    showMask();

    var selectStr = '<select name="selectCate" id="selectCate"><option value="-1">新增主分类</option>';
    var optionStr = "";
    var cateJson = getAllCates();
    for (var i = 1; i < cateJson.length; i++) {
        optionStr = '<option value="' + cateJson[i].id + '">' + cateJson[i].name + '</option>';
        selectStr += optionStr;
    }
    selectStr += '</select>';
    document.querySelector("#selectCate").innerHTML = selectStr;
    document.querySelector("#newCateName").value = "";
}

//新增主分类
function addNewCate(text) {
    var cateJson = getAllCates();
    var repeat = false;

    for (var i = 0; i < cateJson.length; i++) {
        if (cateJson[i].name.toLowerCase() == text.toLowerCase()) {
            repeat = true;
            alert("这个主分类名称已经有主了！");
        }
    }
    if (!repeat) {
        var newCate = {
            "id": cateJson[cateJson.length - 1].id + 1,
            "name": text,
            "child": []
        };

        cateJson.push(newCate);
        localStorage.cate = JSON.stringify(cateJson);
        hideMask();

        initCateList();
    }
}

//新增子分类
function addNewSubCate(id, text) {
    var subCateJson = getAllSubCates();
    var curCate = getCateById(id);
    var repeat = false;

    for (var i = 0; i < curCate.child.length; i++) {
        var curSubCate = getSubCateById(curCate.child[i]);
        if (curSubCate.name.toLowerCase() == text.toLowerCase()) {
            repeat = true;
            alert("这个子分类名称已经有主了！");
        }
    }
    if (!repeat) {
        var newSubCate = {
            "id": subCateJson[subCateJson.length - 1].id + 1,
            "pid": id,
            "name": text,
            "child": []
        };

        subCateJson.push(newSubCate);
        localStorage.subCate = JSON.stringify(subCateJson);
        curCate.child.push(newSubCate.id);
        var cateJson = setCateById(id, curCate);
        localStorage.cate = JSON.stringify(cateJson);
        hideMask();

        initCateList();
    }
}

//删除主分类
function deleteCate(element) {
    var cateJson = getAllCates();
    var curCateID = element.parentNode.parentNode.getAttribute("data-cateID");
    var curCate = getCateById(curCateID);

    //删除主分类中的子分类
    if (curCate.child.length != 0) {
        var subCateJson = getAllSubCates();
        for (var i = 0; i < curCate.child.length; i++) {
            var curSubCateID = curCate.child[i];
            var curSubCate = getSubCateById(curSubCateID);
            
            //删除子分类中的任务
            if (curSubCate.child.length != 0) {
                var taskJson = getAllTasks();
                for (var j = 0; j < curSubCate.child.length; j++) {
                    var curTaskID = curSubCate.child[j];
                    // var curTask = getTaskById(curTaskID);
                    // var taskArr = [curTask];
                    // var curTaskPos = taskJson.indexOf(taskArr);
                    // taskJson.splice(curTaskPos, 1);
                    taskJson = deleteTaskById(curTaskID);
                }
                localStorage.task = JSON.stringify(taskJson);
            }
            // var subCateArr = [curSubCate];
            // var curSubCatePos = subCateJson.indexOf(subCateArr);
            // subCateJson.splice(curSubCatePos, 1);
            subCateJson = deleteSubCateById(curSubCateID);
        }
        localStorage.subCate = JSON.stringify(subCateJson);
    }
    // var cateArr = [curCate];
    // var curCatePos = cateJson.indexOf(cateArr);
    // cateJson.splice(curCatePos, 1);
    cateJson = deleteCateById(curCateID);

    localStorage.cate = JSON.stringify(cateJson);
    initCateList();
    initTaskList();
}

//删除子分类
function deleteSubCate(element) {
    var subCateJson = getAllSubCates();
    var curSubCateID = element.parentNode.parentNode.getAttribute("data-subCateID");
    var curSubCate = getSubCateById(curSubCateID);

    //删除子分类中的任务
    if (curSubCate.child.length != 0) {
        var taskJson = getAllTasks();
        for (var i = 0; i < curSubCate.child.length; i++) {
            var curTaskID = curSubCate.child[i];
            var curTask = getTaskById(curTaskID);

            taskJson = deleteTaskById(curTaskID);
        }
        localStorage.task = JSON.stringify(taskJson);
    }
    
    subCateJson = deleteSubCateById(curSubCateID);

    var curCateID = curSubCate.pid;
    var curCate = getCateById(curCateID);

    for (var i = 0; i < curCate.child.length; i++) {
        if (curCate.child[i] == curSubCateID) {
            curCate.child.splice(i, 1);
        }
    }

    var cateJson = setCateById(curCateID, curCate);

    localStorage.cate = JSON.stringify(cateJson);
    localStorage.subCate = JSON.stringify(subCateJson);

    initCateList();
    initTaskList();
}

//通过id获取主分类
function getCateById(id) {
    var cateJson = getAllCates();
    for (var i = 0; i < cateJson.length; i++) {
        if (cateJson[i].id == id) {
            return cateJson[i];
        }
    }
}

//通过id获取子分类
function getSubCateById(id) {
    var subCateJson = getAllSubCates();
    for (var i = 0; i < subCateJson.length; i++) {
        if (subCateJson[i].id == id) {
            return subCateJson[i];
        }
    }
}

//通过id获取任务
function getTaskById(id) {
    var taskJson = getAllTasks();
    for (var i = 0; i < taskJson.length; i++) {
        if (taskJson[i].id == id) {
            return taskJson[i];
        }
    }
}

//通过id设置主分类
function setCateById(id, cate) {
    var cateJson = getAllCates();
    for (var i = 0; i < cateJson.length; i++) {
        if (cateJson[i].id == id) {
            cateJson[i] = cate;
        }
    }
    return cateJson;
}

//通过id设置子分类
function setSubCateById(id, subCate) {
    var subCateJson = getAllSubCates();
    for (var i = 0; i < subCateJson.length; i++) {
        if (subCateJson[i].id == id) {
            subCateJson[i] = subCate;
        }
    }
    return subCateJson;
}

//通过id设置任务
function setTaskById(id, task) {
    var taskJson = getAllTasks();
    for (var i = 0; i < taskJson.length; i++) {
        if (taskJson[i].id == id) {
            taskJson[i] = task;
        }
    }
    return taskJson;
}

//通过id删除主分类
function deleteCateById(id) {
    var cateJson = getAllCates();
    for (var i = 0; i < cateJson.length; i++) {
        if (cateJson[i].id == id) {
            cateJson.splice(i, 1);
        }
    }
    return cateJson;
}

//通过id删除子分类
function deleteSubCateById(id) {
    var subCateJson = getAllSubCates();
    for (var i = 0; i < subCateJson.length; i++) {
        if (subCateJson[i].id == id) {
            subCateJson.splice(i, 1);
        }
    }
    return subCateJson;
}

//通过id删除任务
function deleteTaskById(id) {
    var taskJson = getAllTasks();
    for (var i = 0; i < taskJson.length; i++) {
        if (taskJson[i].id == id) {
            taskJson.splice(i, 1);
        }
    }
    return taskJson;
}

//*********初始化任务列表*********
/*
* 不传入参数为点击左侧任务列表刷新中间任务列表
* 传入参数为点击中间状态栏刷新中间任务列表
* 返回当前任务列表的数组
*/
function initTaskList(list) {
    var taskJson = list ? list : getCurTaskList();
    var date = [];

    for (var i = 0; i < taskJson.length; i++) {
        var curTaskDate = {
            "name": taskJson[i].date,
            "taskID": []
        };
        if (!isContainedIn(curTaskDate.name, date)) {
            date.push(curTaskDate);
        }
    }
    for (var i = 0; i < date.length; i++) {
        for (var j = 0; j < taskJson.length; j++) {
            if (date[i].name == taskJson[j].date) {
                date[i].taskID.push(taskJson[j]);
            }
        }
    }
    date.sort(compare);

    //显示任务列表
    var ulStr = '<ul id="tasklist">';
    var liStr = "";
    var firstTask = false;
    for (var i = 0; i < date.length; i++) {
        liStr += '<li><p>' + date[i].name + "</p><ul>";
        var taskLiStr = "";
        for (var j = 0; j < date[i].taskID.length; j++) {
            var curTask = date[i].taskID[j];
            if (curTask.finish) {
                taskLiStr += '<li class="task finished" data-taskID="' + curTask.id + '"><h4';
            } else {
                taskLiStr += '<li class="task" data-taskID="' + curTask.id + '"><h4';
            }
            if (i == 0 && j == 0) {
                taskLiStr += ' class="active"';
            }
            taskLiStr += '><span class="fa fa-check"></span>' 
                        + curTask.name + '<span class="fa fa-close"></span></h4></li>';
        }
        liStr += taskLiStr + '</ul></li>';
    }
    ulStr += liStr + '</ul>';
    document.querySelector("#tasklist").innerHTML = ulStr;

    if (date.length != 0) {
        showTaskData(date[0].taskID[0].id);
    } else {
        showTaskData(-1);
    }
}

//获取当前任务数组
function getCurTaskList() {
    var cateContainer = document.querySelector("#cate-container");
    var activeCate = cateContainer.querySelector(".active");
    var curTaskList = [];

    var curSubCate;
    var curTask;

    if (activeCate.parentNode.tagName.toLowerCase() == "section") {
        curTaskList = getAllTasks();
    } else if (activeCate.tagName.toLowerCase() == "h2") {
        //主分类
        var curCateID = activeCate.parentNode.getAttribute("data-cateID");
        var curCate = getCateById(curCateID);

        for (var i = 0; i < curCate.child.length; i++) {
            curSubCate = getSubCateById(curCate.child[i]);
            for (var j = 0; j < curSubCate.child.length; j++) {
                curTask = getTaskById(curSubCate.child[j]);
                curTaskList.push(curTask);
            }
        }

    } else if (activeCate.tagName.toLowerCase() == "h3") {
        //子分类
        var curSubCateID = activeCate.parentNode.getAttribute("data-subCateID");
        curSubCate = getSubCateById(curSubCateID);
        for (var i = 0; i < curSubCate.child.length; i++) {
            curTask = getTaskById(curSubCate.child[i]);
            curTaskList.push(curTask);
        }
    }
    return curTaskList;
}

//检测日期数组中是否新日期
function isContainedIn(obj, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].name == obj) {
            return true;
        }
    }
    return false;
}

//时间排序的比较函数
function compare(obj1, obj2) {
    var value1 = obj1.name;
    var value2 = obj2.name;
    if (value1 < value2) {
        return -1;
    } else if (value1 > value2) {
        return 1;
    } else {
        return 0;
    }
}

//点击新增任务
function clickAddTask(){
    var cateContainer = document.querySelector("#cate-container");
    var activeCate = cateContainer.querySelector(".active");

    if (activeCate.tagName.toLowerCase() == "h2") {
        alert("选择一个子分类再添加任务吧！");
    } else {
        showEditTask();

        //更换按钮为“保存新增任务”
        document.querySelector("#save-cancle").querySelector("button").id = "saveit";
    }
}

//检测新增任务界面数据
function checkDataValidation() {
    var inputTitle = document.querySelector("#input-title").value;
    var inputDate = document.querySelector("#input-date").value;
    var inputContent = document.querySelector("#input-content").value;

    var taskData = {
        "title": inputTitle,
        "date": inputDate,
        "content": inputContent,
        "valid": false
    };

    if (!inputTitle) {
        alert("任务标题不能木有哇！");
    } else if (inputTitle.length > 10) {
        alert("任务标题不能超过10个字哇！");
    } else if (!inputDate) {
        alert("任务时间不能不选哇！");
    } else if (!inputContent) {
        alert("任务内容不能不填哇！");
    } else if (inputContent.length > 400) {
        alert("任务内容不能超过400个字哇！");
    } else {
        taskData.valid = true;
    }
    return taskData;
}

//新增任务
function addNewTask(id, obj) {
    var subCateJson = getAllSubCates();
    var taskJson = getAllTasks();

    var curSubCate = getSubCateById(id);
    var repeat = false;

    for (var i = 0; i < curSubCate.child.length; i++) {
        var curTask = getTaskById(curSubCate.child[i]);
        if (curTask.name.toLowerCase() == obj.title.toLowerCase()) {
            repeat = true;
            alert("这个任务名称已经有主了！");
        }
    }
    if (!repeat) {
        var newTask = {
            "id": taskJson[taskJson.length - 1].id + 1,
            "pid": id,
            "finish": false,
            "name": obj.title,
            "date": obj.date,
            "content": obj.content
        };

        taskJson.push(newTask);
        localStorage.task = JSON.stringify(taskJson);
        curSubCate.child.push(newTask.id);
        subCateJson = setSubCateById(id, curSubCate);
        localStorage.subCate = JSON.stringify(subCateJson);
        hideEditTask();

        initCateList();
        initTaskList();
    }
}

//删除任务
function deleteTask(element) {
    var subCateJson = getAllSubCates();
    var taskJson = getAllTasks();
    var curTaskID = element.parentNode.parentNode.getAttribute("data-taskID");
    var curTask = getTaskById(curTaskID);

    taskJson = deleteTaskById(curTaskID);

    var curSubCateID = curTask.pid;
    var curSubCate = getSubCateById(curSubCateID);

    for (var i = 0; i < curSubCate.child.length; i++) {
        if (curSubCate.child[i] == curTaskID) {
            curSubCate.child.splice(i, 1);
        }
    }

    subCateJson = setSubCateById(curSubCateID, curSubCate);

    localStorage.task = JSON.stringify(taskJson);
    localStorage.subCate = JSON.stringify(subCateJson);

    initCateList();
    initTaskList();
}

//获取当前事件目标的任务id
function getTargetTaskId(element) {
    var targetTaskID = 0;
    if (element.tagName.toLowerCase() == "h4") {
        targetTaskID = element.parentNode.getAttribute("data-taskID");
    } else if (element.parentNode.tagName.toLowerCase() == "h4") {
        targetTaskID = element.parentNode.parentNode.getAttribute("data-taskID");
    }
    return targetTaskID;
}

//任务标记为完成
function finishTask() {
    var taskJson = getAllTasks();
    var targetTaskID = getTargetTaskId(document.querySelector("h4.active"));
    var targetTask = getTaskById(targetTaskID);
    targetTask.finish = true;

    for (var i = 0; i < taskJson.length; i++) {
        if (taskJson[i].id == targetTaskID) {
            taskJson[i] = targetTask;
        }
    }
    localStorage.task = JSON.stringify(taskJson);

    initCateList();
    initTaskList();
}

//更新任务数据
function updateTask() {
    var targetTaskID = getTargetTaskId(document.querySelector("h4.active"));
    var targetTask = getTaskById(targetTaskID);

    targetTask.name = document.querySelector("#input-title").value;
    targetTask.date = document.querySelector("#input-date").value;
    targetTask.content = document.querySelector("#input-content").value;

    var taskJson = setTaskById(targetTaskID, targetTask);

    localStorage.task = JSON.stringify(taskJson);
    hideEditTask();

    initCateList();
    initTaskList();
}