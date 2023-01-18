const createErrorBlock = (errorMessage) => {
    const errorBlock = document.createElement("span");
    errorBlock.innerText = errorMessage;
    errorBlock.className = "error-message-block";
    return errorBlock;
};

const createTaskForm = document.querySelector(".create-task-block");

createTaskForm.addEventListener("submit", async (event) => {
    console.log("event", event);

    event.preventDefault();

    const query = (event.target.query.value || "").trim();
    const myBrandName = (event.target.myBrandName.value || "").trim();

    const errorMessageBlockFromDOM = createTaskForm.querySelector(
        ".error-message-block"
    );

    if (!query) {
        const errorBlock = createErrorBlock("Пустой запрос!");
        createTaskForm.append(errorBlock);
        await Promise.reject();
    }
    if (errorMessageBlockFromDOM) {
        errorMessageBlockFromDOM.remove();
    }
    document.querySelector(".create-task-block__button.default-button");

    const data = await getData(query);
    if (!Array.isArray(data)) {
        alert("Ничего не найдено по этому запросу.");
        await Promise.reject();
    }
    renderList(data, myBrandName);
});

function renderList(data, search) {
    let root = document.getElementById("list");

    for (let elem of data) {
        if (elem === search) {
            root.innerHTML += `<li class="list-group-item list-group-item-danger">
                ${elem}
            </li>`;
        } else root.innerHTML += `<li class="list-group-item">${elem}</li>`;
    }
}

async function getData(brandName) {
    let { data } = await axios.get("http://localhost:3001/?que=" + brandName);
    return data;
}
