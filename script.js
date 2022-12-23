const newTaskInput = document.querySelector("#new-task-input");
const ntc = document.querySelector(".new-task-container");

const taskList = document.querySelector(".tasks");

newTaskInput.onfocus = (e) => {
    const focusColor = "lightblue";
    ntc.style.backgroundColor = focusColor;
    newTaskInput.style.backgroundColor = focusColor;
};

newTaskInput.onblur = (e) => {
    ntc.style.backgroundColor = "";
    newTaskInput.style.backgroundColor = "";
};

/**
 * 새로운 todo 항목 추가하는 함수
 */
function addTask() {
    let newTaskName = newTaskInput.value;
    newTaskInput.value = "";

    let task = document.createElement("div"); //task이름
    task.className = "task";

    let taskName = document.createElement("p");
    taskName.className = "task-name";
    taskName.appendChild(document.createTextNode(newTaskName));
    task.appendChild(taskName);

    let checkBtn = document.createElement("img"); //완료(체크) 버튼
    checkBtn.className = "task-check task-button";
    checkBtn.setAttribute("src", "./svg/check-square.svg");
    task.appendChild(checkBtn);

    let editBtn = document.createElement("img");
    editBtn.className = "task-edit task-button";
    editBtn.setAttribute("src", "./svg/pencil-square.svg");
    task.appendChild(editBtn);

    let removeBtn = document.createElement("img");
    removeBtn.className = "task-remove task-button";
    removeBtn.setAttribute("src", "./svg/x-square.svg");
    task.appendChild(removeBtn);

    checkBtn.addEventListener("click", () => {
        taskName.style.textDecoration = "line-through";
    });

    taskList.appendChild(task);
}
