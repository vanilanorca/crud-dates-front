const apiUrl = 'https://crud-dates-back-d55b8a359189.herokuapp.com/tasks';

let currentEditIndex = null;
let allTasks = [];

async function loadTasks() {
    const response = await fetch(apiUrl);
    const tasks = await response.json();

    console.log('Tarefas recebidas:', tasks);
    allTasks = tasks;
    renderTasks(allTasks);
}

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const categorySelect = document.getElementById('categorySelect');
    const taskText = taskInput.value.trim();
    const category = categorySelect.value;

    if (taskText && category) {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: taskText, category: category })
        });

        const result = await response.json();
        console.log(result);
        taskInput.value = '';
        categorySelect.value = '';
        loadTasks();
    }


    // ANIMACAO DE CORACAO NO BOTAO
    const blackScreen = document.getElementById("blackScreen");

    // Certifique-se de que a imagem esteja visível e reinicie a animação
    blackScreen.style.display = 'block';
    blackScreen.style.animation = "aparecer 1s ease forwards";

    // Mostre a tela preta
    blackScreen.style.display = 'block';

    // Depois de 4 segundos, esconda os elementos
    setTimeout(() => {
        blackScreen.style.animation = "sumir .5s ease forwards"
    }, 1500);
    setTimeout(() => {
        blackScreen.style.display = "none"
    }, 2000);

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        if (task && task.task && task.category) {
            const li = document.createElement('li');
            li.textContent = `${task.task} (${capitalizeFirstLetter(task.category)})`;

            const buttonContainer = document.createElement('div'); // Criação da div para os botões

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => showEditForm(index, task);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Deletar';
            deleteButton.onclick = () => deleteTask(index);

            // Adiciona os botões na div
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            // Adiciona a div com os botões ao li
            li.appendChild(buttonContainer);
            taskList.appendChild(li);
        } else {
            console.warn('Tarefa ou categoria indefinida:', task);
        }
    });
}




function showEditForm(index, task) {
    currentEditIndex = index; // Armazenar o índice da tarefa sendo editada

    // Mostrar o formulário de edição com os valores atuais
    const editTaskInput = document.getElementById('editTaskInput');
    const editCategorySelect = document.getElementById('editCategorySelect');
    editTaskInput.value = task.task;
    editCategorySelect.value = task.category;

    document.getElementById('editForm').style.display = 'block';
    document.getElementById('blackScreen').style.display = 'block';
}

async function updateTask() {
    const editTaskInput = document.getElementById('editTaskInput');
    const editCategorySelect = document.getElementById('editCategorySelect');
    const newTaskText = editTaskInput.value.trim();
    const newCategory = editCategorySelect.value;

    if (newTaskText && newCategory && currentEditIndex !== null) {
        await fetch(`${apiUrl}/${currentEditIndex}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: newTaskText, category: newCategory })
        });
        document.getElementById('editForm').style.display = 'none';
        document.getElementById('blackScreen').style.display = 'none';
        currentEditIndex = null; // Resetar o índice após edição
        loadTasks();
    }
}

function cancelEdit() {
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('blackScreen').style.display = 'none';
    currentEditIndex = null;
}

async function deleteTask(index) {
    await fetch(`${apiUrl}/${index}`, {
        method: 'DELETE'
    });
    loadTasks();
}

function filterTasks() {
    const filterCategory = document.getElementById('filterCategory').value;

    if (filterCategory === "") {
        // Mostrar todas as tarefas se não houver filtro
        renderTasks(allTasks);
    } else {
        // Filtrar as tarefas pela categoria selecionada
        const filteredTasks = allTasks.filter(task => task.category === filterCategory);
        renderTasks(filteredTasks);
    }
}

document.addEventListener('DOMContentLoaded', loadTasks);
