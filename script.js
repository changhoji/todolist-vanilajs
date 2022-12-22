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

    let checkBtn = document.createElement("button"); //완료(체크) 버튼
    checkBtn.className = "task-check";
    checkBtn.appendChild(document.createTextNode("완료!"));

    task.appendChild(taskName);
    task.appendChild(checkBtn);

    checkBtn.addEventListener("click", () => {
        taskName.style.textDecoration = "line-through";
    });

    taskList.appendChild(task);
}
