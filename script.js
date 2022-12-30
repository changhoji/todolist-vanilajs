const newTaskInput = document.querySelector("#new-task-input");
const ntc = document.querySelector(".new-task-container");
const taskList = document.querySelector(".tasks");

let savedTasks = [];
const taskLocalStorage = "tasks";
const timestampLocalStorage = "timestamp";

let lastTimestamp = 0;

newTaskInput.onfocus = (e) => {
    const focusColor = "#CCD0E5";
    ntc.style.backgroundColor = focusColor;
    newTaskInput.style.backgroundColor = focusColor;
};

newTaskInput.onblur = (e) => {
    ntc.style.backgroundColor = "";
    newTaskInput.style.backgroundColor = "";
};

function saveTasks() {
    localStorage.setItem(timestampLocalStorage, JSON.stringify(lastTimestamp));
    localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

function loadLocalStorage() {
    const loadedTimestamp = localStorage.getItem(timestampLocalStorage);
    if (loadedTimestamp !== null) {
        lastTimestamp = Number(loadedTimestamp);
    }

    const loadedTasks = localStorage.getItem(taskLocalStorage);
    if (loadedTasks !== null) {
        savedTasks = JSON.parse(loadedTasks);
        savedTasks.forEach((taskObj) => {
            addTask(taskObj);
        });
    }
}

loadLocalStorage();

/**
 *
 * index.html에서 정보를 입력받아 savedTasks에 추가하고 addTask() 실행
 */
function inputNewTask() {
    const newTaskName = newTaskInput.value;
    newTaskInput.value = "";
    if (newTaskName === "") return;

    let newTask = {
        taskName: newTaskName,
        timestamp: ++lastTimestamp,
        check: "unchecked",
    };

    savedTasks.push(newTask);
    saveTasks();
    addTask(newTask);
}

/**
 *
 * html에 todo 항목 추가하는 함수
 */
function addTask(taskObj) {
    const focusColor = "#CCD0E5";
    let task = document.createElement("div"); //task이름
    task.className = "task";
    task.setAttribute("data-timestamp", taskObj.timestamp);

    //taskname
    let taskName = document.createElement("p");
    taskName.className = "task-name";
    taskName.setAttribute("contenteditable", "true");
    taskName.appendChild(document.createTextNode(taskObj.taskName));
    task.appendChild(taskName);

    //check button
    let checkBtn = document.createElement("img"); //완료(체크) 버튼
    checkBtn.className = "task-check task-button " + taskObj.check;
    checkBtn.setAttribute(
        "src",
        taskObj.check === "unchecked"
            ? "./svg/check-square.svg"
            : "./svg/check-square-fill.svg"
    );
    task.appendChild(checkBtn);
    if (taskObj.check === "checked") {
        task.style.backgroundColor = "#B0B9C6";
    }

    //remove button
    let removeBtn = document.createElement("img");
    removeBtn.className = "task-remove task-button";
    removeBtn.setAttribute("src", "./svg/x-square.svg");
    task.appendChild(removeBtn);

    //for contenteditable task-name
    let beforeTaskName = taskObj.text;

    taskName.addEventListener("focus", (e) => {
        task.style.backgroundColor = focusColor;
        console.log("e");
        beforeTaskName = taskName.innerText;
    });

    taskName.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            taskName.blur();
        }
    });

    taskName.addEventListener("blur", (e) => {
        const newTaskName = taskName.innerHTML;
        task.style.backgroundColor = checkBtn.classList.contains("checked")
            ? "#B0B9C6"
            : "";
        if (newTaskName === "") {
            //되돌리기
            taskName.innerHTML = beforeTaskName;
            return;
        }
        if (newTaskName === beforeTaskName) return;

        const toEditTimestamp = Number(task.dataset.timestamp);
        for (let i = 0; i < savedTasks.length; i++) {
            if (toEditTimestamp === savedTasks[i].timestamp) {
                savedTasks[i].taskName = newTaskName;
                saveTasks();
                break;
            }
        }
    });

    //when click "check"
    checkBtn.addEventListener("click", () => {
        const tasks = taskList.childNodes;
        if (checkBtn.classList.contains("unchecked")) {
            task.style.backgroundColor = "#B0B9C6";
            checkBtn.setAttribute("src", "./svg/check-square-fill.svg");

            checkBtn.classList.replace("unchecked", "checked");

            placeTask(taskList, tasks, task, "checked");

            const toEditTimestamp = Number(task.dataset.timestamp);
            for (let i = 0; i < savedTasks.length; i++) {
                if (toEditTimestamp === savedTasks[i].timestamp) {
                    savedTasks[i].check = "checked";
                }
            }
        } else {
            task.style.backgroundColor = "";
            checkBtn.setAttribute("src", "./svg/check-square.svg");

            checkBtn.classList.replace("checked", "unchecked");

            placeTask(taskList, tasks, task, "unchecked");

            const toEditTimestamp = Number(task.dataset.timestamp);
            for (let i = 0; i < savedTasks.length; i++) {
                if (toEditTimestamp === savedTasks[i].timestamp) {
                    savedTasks[i].check = "unchecked";
                }
            }
        }
        saveTasks();
    });

    //when click "remove"
    removeBtn.addEventListener("click", () => {
        const toDeleteTimestamp = Number(task.dataset.timestamp);
        for (let i = 0; i < savedTasks.length; i++) {
            if (savedTasks[i].timestamp === toDeleteTimestamp) {
                savedTasks.splice(i, 1);
                i--;
            }
        }
        task.remove();
        saveTasks();
    });

    //taskList.prepend(task); -> placeTask()로 대체..!
    placeTask(taskList, taskList.childNodes, task, taskObj.check);
}

function clearStorage() {
    console.log("cleared");
    window.localStorage.clear();
    location.reload();
}

function placeTask(taskList, tasks, task, check) {
    let i = 0;

    if (check === "unchecked") {
        for (i = 0; i < tasks.length; i++) {
            const checkBtnOfTask = tasks[i].querySelector(".task-check");
            if (
                checkBtnOfTask.classList.contains("checked") ||
                tasks[i].dataset.timestamp < task.dataset.timestamp
            )
                break;
        }
        if (i === tasks.length) taskList.insertBefore(task, null);
        else {
            taskList.insertBefore(task, tasks[i]);
        }
    } else {
        //checked인 task는 checked가 있는 영역에, 그리고 timestamp 검사
        for (i = 0; i < tasks.length; i++) {
            const checkBtnOfTask = tasks[i].querySelector(".task-check");
            if (
                checkBtnOfTask.classList.contains("checked") &&
                tasks[i].dataset.timestamp < task.dataset.timestamp
            )
                break;
        }
        if (i === tasks.length) taskList.insertBefore(task, null);
        else {
            taskList.insertBefore(task, tasks[i]);
        }
    }
}
