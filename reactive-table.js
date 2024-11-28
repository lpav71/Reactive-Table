class ReactiveTable {
    constructor(targetHtml, templateId, initialArray = [], partialTemplateIds = [], rowClickHandler) {
        this._array = initialArray;
        this.listeners = [];
        this._targetHtml = targetHtml;
        this._tempalateId = templateId;
        this._partialTemplateIds = partialTemplateIds;
        this.rowClickHandler = rowClickHandler; // Сохраняем переданный обработчик клика
        this.formatters = {}; // Объект для хранения форматирующих функций
        this.bindTable();
        this.notify();
    }

    // Геттер для доступа к массиву
    get array() {
        return this._array;
    }

    // Сеттер для установки нового массива и уведомления слушателей
    set array(newArray) {
        this._array = newArray;
        this.notify();
    }

    // Метод для сортировки массива по заданному ключу
    sort(key, direction = 'asc') {
        this._array.sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        this.notify(); // Уведомляем слушателей о изменении
    }

    // Метод для добавления нового элемента в массив
    addItem(item) {
        this._array.push(item);
        this.notify(); // Уведомляем слушателей о изменении
    }

    // Метод для удаления элемента по индексу
    removeItem(index) {
        this._array.splice(index, 1);
        this.notify(); // Уведомляем слушателей о изменении
    }

    // Метод для редактирования элемента по индексу с новыми значениями
    editItem(index, newValues) {
        // Обновляем элемент массива по заданному индексу, объединяя существующие значения с новыми значениями
        this._array[index] = {...this._array[index], ...newValues};
        this.notify(); // Уведомляем слушателей о изменении
    }

    // Метод для добавления слушателя
    addListener(listener) {
        this.listeners.push(listener);
    }

    // Метод для уведомления всех слушателей о изменении массива
    notify() {
        this.listeners.forEach(listener => listener(this._array));
    }

    // Метод для добавления форматирующей функции
    addFormatter(name, func) {
        this.formatters[name] = func;
    }

    /**
     * Рендер Handlebars шаблонов в HTML элемент
     * @param targetHtml - целевой элемент
     * @param templateId - ID шаблона
     * @param context - передаваемые данные
     * @param partialTemplateIds - массив ID частичных шаблонов
     * @return void
     */
    renderTemplate(
        targetHtml,
        templateId,
        context            = {},
        partialTemplateIds = []
    ) {
        let buffer = document.querySelector(targetHtml);
        buffer.innerHTML = "";

        const templateSource = document.getElementById(templateId).innerHTML;
        const template = Handlebars.compile(templateSource);

        partialTemplateIds.forEach(partialId => {
            const partialSource = document.getElementById(partialId).innerHTML;
            Handlebars.registerPartial(partialId, partialSource);
        });

        let generatedHTML = template(context);
        buffer.insertAdjacentHTML('beforeend', generatedHTML);

        // Применяем форматирование на основе data-formatter
        buffer.querySelectorAll('[data-formatter]').forEach(cell => {
            const formatterName = cell.getAttribute('data-formatter');
            const formatterFunction = this.formatters[formatterName];

            if (typeof formatterFunction === 'function') {
                cell.innerHTML = formatterFunction(cell.textContent);
            }
        });

        // Добавляем обработчик клика на строки
        this.addRowClickListener(buffer);
    }

    // Метод для добавления обработчика кликов по строкам
    addRowClickListener(buffer) {
        buffer.querySelectorAll('tr').forEach((row, index) => {
            row.addEventListener('click', (event) => {
                // Избегаем реакции на клики по кнопкам
                if (event.target.tagName === 'BUTTON') return;

                const rowData = this._array[index]; // Получаем данные по индексу строки
                if (typeof this.rowClickHandler === 'function') {
                    this.rowClickHandler(rowData); // Вызываем внешний обработчик
                }
            });
        });
    }

    // Метод для связывания таблицы с обновлениями массива
    bindTable() {
        //Добавляем слушателя
        this.addListener((newArray) => {
            this.renderTemplate(this._targetHtml, this._tempalateId, {data: newArray}, this._partialTemplateIds);
        });
    }
}
