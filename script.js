let inputData = [
    {name: 'Петр', age: 28, prof: "ДизайнеР"},
    {name: 'Мария', age: 35, prof: "ДизайнеР"},
    {name: 'Иван', age: 33, prof: "ДизайнеР"},
    {name: 'Анна', age: 25, prof: "ДизайнеР"},
    {name: 'Василий', age: 43, prof: "ДизайнеР"},
    {name: 'Дмитрий', age: 51, prof: "ДизайнеР"},
];

// Пример одной функции форматирования
formatUpperCase = function (value) {
    return value.toUpperCase();
}

// Пример другой функции форматирования
formatLowerCase = function (value) {
    return `<b style="color: #2d9f2d">${value.toLowerCase()}</b>`;
}

formatAge = function (value) {
    return `<b style="color: #5f9ce8">${value} лет</b>`;
}

// Внешняя функция для обработки клика по строке
handleRowClick = function (rowData) {
    console.log('Row clicked:', rowData);
    // Здесь можно добавить любую логику для обработки клика по строке
}

//Инициализация класса с передачей входного массива (Нельзя рендерить если используются функции форматирования)
const reactiveTable = new ReactiveTable('#table-body', 'tbody--template', [], [], handleRowClick);

reactiveTable.addFormatter('format-upper-case', formatUpperCase);
reactiveTable.addFormatter('format-lower-case', formatLowerCase);
reactiveTable.addFormatter('format-age', formatAge);

reactiveTable.array = inputData;

// Обработчик для удаления элемента
deleteRow = function (index) {
    reactiveTable.removeItem(index); // Удаляем элемент из массива
}

// Обработчик для изменения имени
editName = function (index) {
    const item = reactiveTable.array[index]; //Получаем текущую запись
    const newName = prompt("Введите новое имя:", item.name);
    if (newName !== null) {
        // Обновить элемент
        reactiveTable.editItem(index, {name: newName}); //Обновляем текущую запись
    }
}

// Обработчик для изменения возраста
editAge = function (index) {
    const item = reactiveTable.array[index]; //Получаем текущую запись
    const newAge = prompt("Введите новый возраст:", item.age);
    if (newAge !== null) {
        // Обновить элемент
        reactiveTable.editItem(index, {age: newAge}); //Обновляем текущую запись
    }
}

// Обработчик для добавления элемента
addItem = function () {
    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value);
    if (name && !isNaN(age)) {
        reactiveTable.addItem({name, age}); //Добавляем новую запись
        // Очищаем поля ввода
        document.getElementById('name').value = '';
        document.getElementById('age').value = '';
    }
}
