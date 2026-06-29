$(document).ready(function() {
    
    let currentTheme = localStorage.getItem('crm_theme') || 'light';
    updateThemeIcon(currentTheme);

    $('#themeToggle').click(function() {
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

    let defaultVenues = [
        { id: 1, date: "2026-06-30", venue: "Astana IT University, Assembly Hall", event: "Защита Практики", client: "Кафедра SE", status: "Подтверждено" },
        { id: 2, date: "2026-07-15", venue: "Radisson Blu, Grand Ballroom", event: "IT Forum 2026", client: "TechCorp", status: "Оплачено" },
        { id: 3, date: "2026-07-22", venue: "Hilton Astana, Зал А", event: "Свадьба (VIP)", client: "Частное лицо", status: "Ожидает предоплату" },
        { id: 4, date: "2026-08-05", venue: "EXPO Congress Center", event: "Выставка TechExpo", client: "Министерство Цифровизации", status: "Подтверждено" }
    ];

    let venuesData = JSON.parse(localStorage.getItem('crm_venues_v3')) || defaultVenues;
    let nextVenueId = parseInt(localStorage.getItem('crm_nextVenueId_v3')) || 5;

    let sortCol = 'date';
    let sortAsc = true;

    function saveVenues() {
        localStorage.setItem('crm_venues_v3', JSON.stringify(venuesData));
        localStorage.setItem('crm_nextVenueId_v3', nextVenueId.toString());
    }

    function formatDate(isoString) {
        if (!isoString) return '';
        let parts = isoString.split('-');
        if (parts.length !== 3) return isoString;
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }

    $('.sortable').click(function() {
        let clickedCol = $(this).data('col');
        
        if (sortCol === clickedCol) {
            sortAsc = !sortAsc; 
        } else {
            sortCol = clickedCol; 
            sortAsc = true;       
        }
        renderVenues();
    });

    function renderVenues() {
        let tbody = $('#venuesTable');
        tbody.empty();

        $('.sort-icon').removeClass('fa-sort-up fa-sort-down text-primary').addClass('fa-sort');
        let activeHeaderIcon = $(`.sortable[data-col="${sortCol}"] i`);
        activeHeaderIcon.removeClass('fa-sort').addClass(sortAsc ? 'fa-sort-up text-primary' : 'fa-sort-down text-primary');

        let sortedData = [...venuesData].sort((a, b) => {
            let valA = a[sortCol].toLowerCase();
            let valB = b[sortCol].toLowerCase();
            
            let comparison = valA.localeCompare(valB, 'ru');
            return sortAsc ? comparison : -comparison;
        });

        sortedData.forEach((item, index) => {
            let statusBadge = '';
            if (item.status === 'Подтверждено' || item.status === 'Оплачено') {
                statusBadge = `<span class="badge bg-success shadow-sm">${item.status}</span>`;
            } else if (item.status === 'Ожидает предоплату') {
                statusBadge = `<span class="badge bg-warning text-dark shadow-sm">${item.status}</span>`;
            } else {
                statusBadge = `<span class="badge bg-secondary shadow-sm">${item.status}</span>`;
            }

            let animDelay = index * 0.05;
            let displayDate = formatDate(item.date);
            
            let row = `
                <tr class="animated-row" style="animation-delay: ${animDelay}s">
                    <td class="fw-bold ps-4 text-primary">${displayDate}</td>
                    <td class="fw-bold"><i class="fa-solid fa-location-dot text-danger opacity-75 me-2"></i>${item.venue}</td>
                    <td>${item.event}</td>
                    <td class="text-muted">${item.client}</td>
                    <td>${statusBadge}</td>
                    <td class="pe-4 text-end">
                        <button class="btn btn-sm btn-outline-primary edit-venue-btn rounded-circle me-1" data-id="${item.id}" title="Редактировать">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-venue-btn rounded-circle" data-id="${item.id}" title="Удалить">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    $('#openAddVenueBtn').click(function() {
        $('#venueModalTitle').text('Забронировать площадку');
        $('#venueForm')[0].reset();
        $('#vId').val('');
        $('#venueModal').modal('show');
    });

    $('#venuesTable').on('click', '.edit-venue-btn', function() {
        let id = $(this).data('id');
        let item = venuesData.find(v => v.id === id);
        if (item) {
            $('#venueModalTitle').text('Редактировать бронь');
            $('#vId').val(item.id);
            $('#vDate').val(item.date); 
            $('#vName').val(item.venue);
            $('#vEvent').val(item.event);
            $('#vClient').val(item.client);
            $('#vStatus').val(item.status);
            $('#venueModal').modal('show');
        }
    });

    $('#saveVenueBtn').click(function() {
        let id = $('#vId').val();
        let date = $('#vDate').val(); 
        let name = $('#vName').val();
        let event = $('#vEvent').val();
        let client = $('#vClient').val();
        let status = $('#vStatus').val().trim();

        if (!date || !name || !event || !status) {
            alert("Заполните обязательные поля!");
            return;
        }

        if (id) {
            let index = venuesData.findIndex(v => v.id == id);
            if (index !== -1) {
                venuesData[index].date = date;
                venuesData[index].venue = name;
                venuesData[index].event = event;
                venuesData[index].client = client;
                venuesData[index].status = status;
            }
        } else {
            venuesData.push({
                id: nextVenueId++,
                date: date,
                venue: name,
                event: event,
                client: client,
                status: status
            });
        }

        saveVenues();
        renderVenues();
        $('#venueModal').modal('hide');
    });

    let defaultContractors = [
        { id: 1, name: "Иван Смирнов", role: "Главный звукорежиссер", phone: "+7 (777) 123-45-67", rating: 5, icon: "fa-headphones" },
        { id: 2, name: "Айгерим Касымова", role: "Декоратор-флорист", phone: "+7 (701) 987-65-43", rating: 4, icon: "fa-seedling" },
        { id: 3, name: "ТОО 'LightShow Pro'", role: "Художники по свету", phone: "+7 (7172) 55-44-33", rating: 5, icon: "fa-lightbulb" },
        { id: 4, name: "Данияр Омаров", role: "LED-Инженер (Экраны)", phone: "+7 (747) 111-22-33", rating: 5, icon: "fa-tv" },
        { id: 5, name: "Студия 'VideoArt'", role: "Видеооператоры / Трансляция", phone: "+7 (707) 555-88-99", rating: 4, icon: "fa-video" }
    ];

    let contractorsData = JSON.parse(localStorage.getItem('crm_contractors_v3')) || defaultContractors;
    let nextContractorId = parseInt(localStorage.getItem('crm_nextContractorId_v3')) || 6;

    function saveContractors() {
        localStorage.setItem('crm_contractors_v3', JSON.stringify(contractorsData));
        localStorage.setItem('crm_nextContractorId_v3', nextContractorId.toString());
    }

    function renderContractors() {
        let grid = $('#contractorsGrid');
        grid.empty();

        contractorsData.forEach((item, index) => {
            let stars = '⭐'.repeat(item.rating);
            let animDelay = index * 0.05;

            let card = `
                <div class="col-md-6 col-lg-4 animated-row" style="animation-delay: ${animDelay}s">
                    <div class="card shadow-sm border-0 bg-body custom-rounded card-hover h-100 position-relative">
                        
                        <div class="position-absolute top-0 end-0 p-2 z-3">
                            <button class="btn btn-sm btn-light border-0 edit-contractor-btn shadow-sm rounded-circle text-primary me-1" data-id="${item.id}" title="Изменить">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn btn-sm btn-light border-0 delete-contractor-btn shadow-sm rounded-circle text-danger" data-id="${item.id}" title="Удалить">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>

                        <div class="card-body p-4 text-center mt-2">
                            <div class="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" style="width: 60px; height: 60px;">
                                <i class="fa-solid ${item.icon} fs-3"></i>
                            </div>
                            <h5 class="fw-bold mb-1">${item.name}</h5>
                            <p class="text-muted small mb-3 text-uppercase fw-bold">${item.role}</p>
                            
                            <hr class="opacity-25">
                            
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-light text-dark border"><i class="fa-solid fa-phone me-1 text-success"></i> ${item.phone}</span>
                                <span title="Рейтинг подрядчика">${stars}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            grid.append(card);
        });
    }

    $('#openAddContractorBtn').click(function() {
        $('#contractorModalTitle').text('Новый подрядчик');
        $('#contractorForm')[0].reset();
        $('#cId').val('');
        $('#contractorModal').modal('show');
    });

    $('#contractorsGrid').on('click', '.edit-contractor-btn', function() {
        let id = $(this).data('id');
        let item = contractorsData.find(c => c.id === id);
        if (item) {
            $('#contractorModalTitle').text('Редактировать подрядчика');
            $('#cId').val(item.id);
            $('#cName').val(item.name);
            $('#cRole').val(item.role);
            $('#cPhone').val(item.phone);
            $('#cIcon').val(item.icon);
            $('#contractorModal').modal('show');
        }
    });

    $('#saveContractorBtn').click(function() {
        let id = $('#cId').val();
        let name = $('#cName').val();
        let role = $('#cRole').val();
        let phone = $('#cPhone').val();
        let iconInput = $('#cIcon').val().trim();

        if (!name || !role || !iconInput) {
            alert("Заполните Имя, Роль и Иконку!");
            return;
        }

        let safeIcon = iconInput.includes('fa-') ? iconInput : 'fa-star';

        if (id) {
            let index = contractorsData.findIndex(c => c.id == id);
            if (index !== -1) {
                contractorsData[index].name = name;
                contractorsData[index].role = role;
                contractorsData[index].phone = phone;
                contractorsData[index].icon = safeIcon;
            }
        } else {
            contractorsData.unshift({
                id: nextContractorId++,
                name: name,
                role: role,
                phone: phone,
                rating: 5, 
                icon: safeIcon
            });
        }

        saveContractors();
        renderContractors();
        $('#contractorModal').modal('hide');
    });

    $('#venuesTable').on('click', '.delete-venue-btn', function() {
        $('#deleteTargetType').val('venue');
        $('#deleteTargetId').val($(this).data('id'));
        $('#deleteModal').modal('show');
    });

    $('#contractorsGrid').on('click', '.delete-contractor-btn', function() {
        $('#deleteTargetType').val('contractor');
        $('#deleteTargetId').val($(this).data('id'));
        $('#deleteModal').modal('show');
    });

    $('#confirmDeleteBtn').click(function() {
        let type = $('#deleteTargetType').val();
        let id = $('#deleteTargetId').val();

        if (type === 'venue') {
            venuesData = venuesData.filter(v => v.id != id);
            saveVenues();
            renderVenues();
        } else if (type === 'contractor') {
            contractorsData = contractorsData.filter(c => c.id != id);
            saveContractors();
            renderContractors();
        }

        $('#deleteModal').modal('hide');
    });

    renderVenues();
    renderContractors();
});