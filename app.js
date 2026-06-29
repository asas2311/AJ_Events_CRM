$(document).ready(function() {
    
    let currentTheme = localStorage.getItem('crm_theme') || 'light';
    $('html').attr('data-bs-theme', currentTheme);
    updateThemeIcon(currentTheme);

    $('#themeToggle').click(function(e) {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        $('html').attr('data-bs-theme', currentTheme);
        localStorage.setItem('crm_theme', currentTheme);
        updateThemeIcon(currentTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            $('#themeToggle').html('<i class="fa-solid fa-sun text-warning"></i>');
        } else {
            $('#themeToggle').html('<i class="fa-solid fa-moon"></i>');
        }
    }

    let defaultData = [
        { id: 104, name: "Проектор Epson EB-X41", category: "Видео", desc: "В кейсе, с пультом", qty: 3, status: "В ремонте" },
        { id: 112, name: "Баннер Roll-up 2х0.8м", category: "Декорации", desc: "Каркас без полотна", qty: 15, status: "На складе" },
        { id: 101, name: "Радиомикрофон Shure SM58", category: "Звук", desc: "База + 2 микрофона", qty: 12, status: "На складе" },
        { id: 109, name: "Световая голова Beam 230W", category: "Свет", desc: "В двойных кейсах", qty: 12, status: "На мероприятии" },
        { id: 115, name: "Конструкция для Press-wall", category: "Декорации", desc: "Трубы Joker (3x2 м)", qty: 5, status: "На складе" },
        { id: 103, name: "Активная колонка JBL EON615", category: "Звук", desc: "Со стойками и кабелями", qty: 6, status: "На складе" },
        { id: 106, name: "LED-экран кабинет 500х500", category: "Видео", desc: "Шаг пикселя P3.91", qty: 40, status: "На мероприятии" },
        { id: 111, name: "DMX-пульт GrandMA2", category: "Свет", desc: "Основной пульт управления", qty: 1, status: "В ремонте" },
        { id: 113, name: "Красная ковровая дорожка", category: "Декорации", desc: "Длина 10 метров, ширина 2м", qty: 3, status: "На складе" },
        { id: 102, name: "Цифровой микшер Behringer X32", category: "Звук", desc: "В жестком кейсе", qty: 2, status: "На мероприятии" },
        { id: 108, name: "LED-прожектор RGB PAR", category: "Свет", desc: "Архитектурная подсветка", qty: 24, status: "На складе" },
        { id: 116, name: "Подиум сценический 2х1м", category: "Декорации", desc: "Высота ножек 40 см", qty: 18, status: "На мероприятии" },
        { id: 105, name: "Плазменная панель Samsung 65'", category: "Видео", desc: "Напольная стойка в комплекте", qty: 4, status: "На складе" },
        { id: 110, name: "Генератор тяжелого дыма", category: "Спецэффекты", desc: "Жидкость залита на 50%", qty: 2, status: "На складе" },
        { id: 107, name: "Видеомикшер Blackmagic ATEM", category: "Видео", desc: "Для онлайн-трансляций", qty: 1, status: "На складе" },
        { id: 114, name: "Стойка ограждения (золото)", category: "Декорации", desc: "С красным бархатным канатом", qty: 20, status: "На мероприятии" },
        { id: 117, name: "Лазерная установка RGB 3W", category: "Свет", desc: "Управление через ILDA", qty: 2, status: "На складе" },
        { id: 118, name: "Микрофонная стойка K&M", category: "Звук", desc: "Журавль, черная", qty: 10, status: "На мероприятии" },
        { id: 119, name: "Генератор мыльных пузырей", category: "Спецэффекты", desc: "Требует чистки", qty: 1, status: "На складе" },
        { id: 120, name: "Пушка конфетти", category: "Спецэффекты", desc: "Без баллонов СО2", qty: 4, status: "В ремонте" },
        { id: 121, name: "Радиосистема Sennheiser EW 100", category: "Звук", desc: "Петличный микрофон", qty: 5, status: "На складе" },
        { id: 122, name: "Кабель HDMI 20 метров", category: "Коммутация", desc: "Оптический HDMI", qty: 8, status: "На мероприятии" },
        { id: 123, name: "Силовой удлинитель 50м", category: "Коммутация", desc: "На катушке", qty: 3, status: "На складе" },
        { id: 124, name: "Световая голова Wash 19x15W", category: "Свет", desc: "Заливочный свет", qty: 8, status: "На складе" },
        { id: 125, name: "Суфлер для спикера", category: "Видео", desc: "С монитором 24 дюйма", qty: 1, status: "На складе" }
    ];

    let inventory = JSON.parse(localStorage.getItem('crm_inventory_v8')) || defaultData;
    let nextId = parseInt(localStorage.getItem('crm_nextId_v8')) || 126;

    function saveDataToStorage() {
        localStorage.setItem('crm_inventory_v8', JSON.stringify(inventory));
        localStorage.setItem('crm_nextId_v8', nextId.toString());
        updateDynamicLists(); 
    }

    function getStatusBadge(status) {
        if (status === 'На складе') return '<span class="badge bg-success shadow-sm">На складе</span>';
        if (status === 'На мероприятии') return '<span class="badge bg-warning text-dark shadow-sm">На мероприятии</span>';
        if (status === 'В ремонте') return '<span class="badge bg-danger shadow-sm">В ремонте</span>';

        let hash = 0;
        for (let i = 0; i < status.length; i++) {
            hash = status.charCodeAt(i) + ((hash << 5) - hash);
        }
        let colorIndex = Math.abs(hash) % 5; 
        return `<span class="badge badge-custom-${colorIndex} shadow-sm">${status}</span>`;
    }

    function updateDynamicLists() {
        let categories = new Set();
        let statuses = new Set();
        
        inventory.forEach(item => {
            if(item.category) categories.add(item.category);
            if(item.status) statuses.add(item.status);
        });

        $('#categoryList').empty();
        categories.forEach(c => $('#categoryList').append(`<option value="${c}">`));
        $('#statusList').empty();
        statuses.forEach(s => $('#statusList').append(`<option value="${s}">`));

        let catMenu = $('#filterCategoryMenu');
        catMenu.empty().append(`<li><a class="dropdown-item category-item active" href="#" data-val="All">Все категории</a></li>`);
        categories.forEach(c => catMenu.append(`<li><a class="dropdown-item category-item" href="#" data-val="${c}">${c}</a></li>`));

        let statMenu = $('#filterStatusMenu');
        statMenu.empty().append(`<li><a class="dropdown-item status-item active" href="#" data-val="All">Все статусы</a></li>`);
        statuses.forEach(s => statMenu.append(`<li><a class="dropdown-item status-item" href="#" data-val="${s}">${s}</a></li>`));

        bindDropdownClicks();
    }

    function bindDropdownClicks() {
        $('.category-item').off('click').on('click', function(e) {
            e.preventDefault();
            $('.category-item').removeClass('active');
            $(this).addClass('active');
            $('#catText').text($(this).text()); 
            $('#filterCategory').val($(this).data('val')); 
            applyFilters();
        });

        $('.status-item').off('click').on('click', function(e) {
            e.preventDefault();
            $('.status-item').removeClass('active');
            $(this).addClass('active');
            $('#statText').text($(this).text());
            $('#filterStatus').val($(this).data('val'));
            applyFilters();
        });
    }

    function renderTable(data) {
        let tbody = $('#inventoryTable');
        tbody.empty();

        if(data.length === 0) {
            tbody.append('<tr><td colspan="7" class="text-center text-muted py-5">Ничего не найдено</td></tr>');
            return;
        }

        data.forEach(function(item, index) { 
            let statusBadge = getStatusBadge(item.status); 
            let description = item.desc ? item.desc : '<span class="text-muted">-</span>';
            let animDelay = (index % 15) * 0.04; 

            let row = `
                <tr class="animated-row" style="animation-delay: ${animDelay}s">
                    <td class="text-muted fw-bold ps-4">${index + 1}</td>
                    <td class="fw-bold">${item.name}</td>
                    <td>${item.category}</td>
                    <td><small>${description}</small></td>
                    <td>${item.qty} шт.</td>
                    <td>${statusBadge}</td>
                    <td class="pe-4">
                        <button class="btn btn-sm btn-outline-primary edit-btn rounded-circle me-1" data-id="${item.id}" title="Редактировать">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn rounded-circle" data-id="${item.id}" title="Удалить">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });

        $('#totalItems').text(inventory.length);
        let available = inventory.filter(i => i.status === 'На складе').length;
        $('#availableItems').text(available);
    }

    function applyFilters() {
        let searchText = $('#searchInput').val().toLowerCase();
        let catFilter = $('#filterCategory').val(); 
        let statFilter = $('#filterStatus').val();  

        let filteredData = inventory.filter(function(item) {
            let matchText = item.name.toLowerCase().includes(searchText) || 
                            (item.desc && item.desc.toLowerCase().includes(searchText));
            let matchCategory = (catFilter === "All") || (item.category === catFilter);
            let matchStatus = (statFilter === "All") || (item.status === statFilter);

            return matchText && matchCategory && matchStatus;
        });

        renderTable(filteredData);
    }

    $('#searchInput').on('keyup', applyFilters);

    $('#openAddModalBtn').click(function() {
        $('#modalTitle').text('Новое оборудование');
        $('#itemForm')[0].reset();
        $('#itemId').val('');
        $('#itemModal').modal('show');
    });

    $('#inventoryTable').on('click', '.edit-btn', function() {
        let idToEdit = $(this).data('id');
        let item = inventory.find(i => i.id === idToEdit); 
        
        if (item) {
            $('#modalTitle').text('Редактировать оборудование');
            $('#itemId').val(item.id); 
            $('#itemName').val(item.name);
            $('#itemCategory').val(item.category);
            $('#itemDesc').val(item.desc);
            $('#itemQty').val(item.qty);
            $('#itemStatus').val(item.status);
            $('#itemModal').modal('show');
        }
    });

    $('#saveItemBtn').click(function() {
        let id = $('#itemId').val();
        let name = $('#itemName').val();
        let category = $('#itemCategory').val().trim(); 
        let desc = $('#itemDesc').val();
        let qty = $('#itemQty').val();
        let status = $('#itemStatus').val().trim();

        if (name === "" || qty === "" || category === "" || status === "") {
            alert("Заполните Наименование, Категорию, Кол-во и Статус!");
            return;
        }

        if (id) {
            let itemIndex = inventory.findIndex(i => i.id == id);
            if (itemIndex !== -1) {
                inventory[itemIndex].name = name;
                inventory[itemIndex].category = category;
                inventory[itemIndex].desc = desc;
                inventory[itemIndex].qty = parseInt(qty);
                inventory[itemIndex].status = status;
            }
        } else {
            inventory.push({
                id: nextId++,
                name: name,
                category: category,
                desc: desc,
                qty: parseInt(qty),
                status: status
            });
        }

        saveDataToStorage();
        $('#itemModal').modal('hide');
        
        $('#searchInput').val('');
        $('#filterCategory').val('All');
        $('#catText').text('Все категории');
        $('#filterStatus').val('All');
        $('#statText').text('Все статусы');
        applyFilters(); 
    });

    $('#inventoryTable').on('click', '.delete-btn', function() {
        let idToDelete = $(this).data('id');
        $('#deleteItemId').val(idToDelete); 
        $('#deleteModal').modal('show');
    });

    $('#confirmDeleteBtn').click(function() {
        let idToDelete = $('#deleteItemId').val();
        inventory = inventory.filter(item => item.id != idToDelete); 
        
        saveDataToStorage(); 
        applyFilters(); 
        $('#deleteModal').modal('hide'); 
    });

    updateDynamicLists();
    renderTable(inventory);
});