document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const darkModeToggle = document.getElementById('dark-mode-toggle');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


  function setDarkMode(enabled) {
    document.body.classList.toggle('dark', enabled);
    localStorage.setItem('darkMode', enabled);
  }

  // Load dark mode preference
  const darkModeEnabled = JSON.parse(localStorage.getItem('darkMode'));
  if (darkModeEnabled) {
    setDarkMode(true);
  }

  darkModeToggle.addEventListener('click', () => {
    const enabled = document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', enabled);
  });

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.textContent = task.text;
      if (task.completed) {
        li.classList.add('completed');
      }

      li.addEventListener('click', () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'X';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        li.classList.add('removing');
        setTimeout(() => {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        }, 300); // Wait 300ms for animation
      });

      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });

    const taskCounter = document.getElementById('task-counter');
    taskCounter.textContent = `You have ${tasks.filter(task => !task.completed).length} tasks left`;
  }

  addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text !== '') {
      tasks.push({ text: text, completed: false });
      saveTasks();
      renderTasks();
      taskInput.value = '';
    }
  });

  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTaskBtn.click();
    }
  });

  clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all tasks?')) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  });

  renderTasks();
});
