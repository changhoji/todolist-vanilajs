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
    console.log("save!");
    localStorage.setItem(timestampLocalStorage, JSON.stringify(lastTimestamp));
    localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

function loadLocalStorage() {
    const loadedTimestamp = localStorage.getItem(timestampLocalStorage);
    if (loadedTimestamp !== null) {
        lastTimestamp = Number(loadedTimestamp);
    }

    const loadedTasks = localStorage.getItem(taskLocalStorage);
    console.log("load: " + loadedTasks);
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
    console.log("add: " + taskObj);
    let task = document.createElement("div"); //task이름
    task.className = "task";
    task.setAttribute("data-timestamp", taskObj.timestamp);

    //taskname
    let taskName = document.createElement("p");
    taskName.className = "task-name";
    taskName.appendChild(document.createTextNode(taskObj.taskName));
    task.appendChild(taskName);

    //check button
    let checkBtn = document.createElement("img"); //완료(체크) 버튼
    checkBtn.className = "task-check task-button unchecked";
    checkBtn.setAttribute("src", "./svg/check-square.svg");
    task.appendChild(checkBtn);

    //edit button
    let editBtn = document.createElement("img");
    editBtn.className = "task-edit task-button";
    editBtn.setAttribute("src", "./svg/pencil-square.svg");
    task.appendChild(editBtn);

    //edit input
    let editInput = document.createElement("input");
    editInput.setAttribute("type", "text");
    editInput.className = "task-edit-input";
    task.prepend(editInput);

    //remove button
    let removeBtn = document.createElement("img");
    removeBtn.className = "task-remove task-button";
    removeBtn.setAttribute("src", "./svg/x-square.svg");
    task.appendChild(removeBtn);

    //when click "check"
    checkBtn.addEventListener("click", () => {
        if (editInput.style.display === "inline") return;
        const tasks = taskList.childNodes;
        if (checkBtn.classList.contains("unchecked")) {
            task.style.backgroundColor = "#B0B9C6";
            checkBtn.setAttribute("src", "./svg/check-square-fill.svg");

            let i;
            for (i = 0; i < tasks.length; i++) {
                if (
                    tasks[i].childNodes[1].classList.contains("checked") &&
                    tasks[i].dataset.timestamp < task.dataset.timestamp
                )
                    break;
            }
            if (i === tasks.length) taskList.insertBefore(task, null);
            else taskList.insertBefore(task, tasks[i]);

            checkBtn.classList.replace("unchecked", "checked");
        } else {
            task.style.backgroundColor = "";
            checkBtn.setAttribute("src", "./svg/check-square.svg");

            let i;
            for (i = 0; i < tasks.length; i++) {
                if (
                    tasks[i].childNodes[1].classList.contains("checked") ||
                    tasks[i].dataset.timestamp <= task.dataset.timestamp
                )
                    break;
            }
            if (i === tasks.length) taskList.insertBefore(task, null);
            else taskList.insertBefore(task, tasks[i]);

            checkBtn.classList.replace("checked", "unchecked");
        }
    });

    //when click "edit"
    editBtn.addEventListener("click", () => {
        if (checkBtn.classList.contains("checked")) return;
        const beforeTaskName =
            task.getElementsByClassName("task-name")[0].innerHTML;

        //modify displays
        taskName.style.display = "none";
        editInput.style.display = "inline";

        editInput.setAttribute("placeholder", beforeTaskName);

        //add input element

        //아래 두 eventlistener에 대한 함수
        function doEditTask(e) {
            if (editInput.style.display === "none") return;

            const newTaskName = editInput.value;
            editInput.value = "";
            if (newTaskName !== "") {
                taskName.innerHTML = newTaskName;
            }

            editInput.style.display = "none";
            taskName.style.display = "";
        }

        //add input element's eventlisteners
        editInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") doEditTask(e);
        });
        editInput.addEventListener("blur", (e) => {
            doEditTask(e);
        });

        editInput.focus();
    });

    //when click "remove"
    removeBtn.addEventListener("click", () => {
        const toDeleteTimestamp = task.dataset.timestamp;
        for (let i = 0; i < savedTasks.length; i++) {
            console.log("i = " + i);
            console.log(
                "toDeleteTimestamp = " +
                    typeof toDeleteTimestamp +
                    toDeleteTimestamp +
                    ", nowTimeStamp = " +
                    typeof savedTasks[i].timestamp +
                    savedTasks[i].timestamp
            );
            if (savedTasks[i].timestamp === Number(toDeleteTimestamp)) {
                console.log("found!");
                console.log(savedTasks[i]);
                savedTasks.splice(i, 1);
                i--;
            }
        }
        task.remove();
        saveTasks();
    });

    taskList.prepend(task);

    //localstorage에 저장
}

function clearStorage() {
    console.log("cleared");
    window.localStorage.clear();
}
