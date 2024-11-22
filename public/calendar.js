const monthYear = document.getElementById("monthYear");
const daysContainer = document.getElementById("days");

let currentDate = new Date();
let isSingleEventVisible = false;
let lastEventId = null;


// Alternar entre vista de un evento y vista de todos los eventos
function toggleSingleEventView (event) {
    const currentEventId = event.fieldData.id;

    if (isSingleEventVisible && lastEventId === currentEventId) {
        displayEvents();
        isSingleEventVisible = false;
        lastEventId = null;

        document.querySelectorAll('.selected-event').forEach(element => {
            element.classList.remove('selected-event');
        });
    } else {
        displayEventInfo(event);
        isSingleEventVisible = true;
        lastEventId = currentEventId;

        document.querySelectorAll('.selected-event').forEach(element => {
            element.classList.remove('selected-event');
        });

        const dayElements = Array.from(document.querySelectorAll('.calendar-day'));
        dayElements.forEach(dayElement => {
            const dayNumber = dayElement.querySelector('.day-number');
            if (dayNumber && parseInt(dayNumber.textContent) === new Date(event.fieldData['start-date-time']).getDate()) {
                dayNumber.classList.add('selected-event');
            }
        });
    }
}

// Function to format the date 
function formatDateTime(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const daySuffix = (day % 10 === 1 && day !== 11) ? "st" :
        (day % 10 === 2 && day !== 12) ? "nd" :
        (day % 10 === 3 && day !== 13) ? "rd" : "th";

    const hour = date.getHours();
    const period = hour >= 12 ? "pm" : "am";
    
    const formattedHour = hour % 12 || 12;
    return `${month} ${day}${daySuffix}, ${formattedHour}${period}`;
}

function displayEventInfo(event) {
    const eventContainer = document.getElementById('eventList');
    eventContainer.innerHTML = '';

    const { name, description, location, 'start-date-time': startDate, 'end-date-time': endDate, image } = event.fieldData;

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    const formattedStartDate = formatDateTime(startDateTime);
    const formattedEndTime = formatDateTime(endDateTime).split(", ")[1];

    const eventElement = document.createElement('div');
    eventElement.classList.add('event-item');

    eventElement.innerHTML = `
        <div class="upcoming-events">Upcoming Events</div>
        <div class="container-info-event">
            <img src="${image.url}" alt="${image.alt || name}">
            <div class="data-event">
                <p>${formattedStartDate} - ${formattedEndTime}</p>
                <p class="title-place">${location}</p>
                <div class="data-description">${description}</div>
            </div>
        </div>
    `;

    eventContainer.appendChild(eventElement);
    eventContainer.scrollIntoView({ behavior: 'smooth' });
}


// Modificar renderCalendar para usar displayEventInfo en cada día


function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];

    monthYear.textContent = `${monthNames[month]} ${year}`;
    daysContainer.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        daysContainer.appendChild(emptyCell);
    }

    const spanIm = [];
    let choosedElement = null;
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add('calendar-day');

        const dayNumber = document.createElement('span');
        dayNumber.textContent = day;
        dayNumber.classList.add('day-number');
        dayElement.appendChild(dayNumber);
        spanIm.push(dayNumber)

        const eventsThisDay = eventData.filter(event => {
            const eventDate = new Date(event.fieldData['start-date-time']);
            return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
        });

        if (eventsThisDay.length > 0) {
            dayElement.classList.add('has-event'); // Asignar clase específica
        }

        eventsThisDay.forEach(eventThisDay => {
            const { image } = eventThisDay.fieldData;
            const imgElement = document.createElement('img');
            imgElement.src = image.url;
            imgElement.alt = image.alt || eventThisDay.fieldData.name;
            imgElement.classList.add('event-thumbnail');
        
            dayElement.appendChild(imgElement);
            dayElement.classList.add('event-day');
        
            dayElement.addEventListener('click', () => {
                // Si el elemento actual ya es el seleccionado, quita la clase y resetea el estado
                if (choosedElement && dayElement.contains(choosedElement)) {
                    choosedElement.classList.remove('selected-event');
                    choosedElement = null; // Reiniciar el elemento seleccionado
                    displayEvents()
                } else {
                    // Eliminar la clase del elemento previamente seleccionado, si existe
                    if (choosedElement !== null) {
                        choosedElement.classList.remove('selected-event');
                    }
        
                    // Asignar la clase al nuevo elemento seleccionado
                    spanIm.forEach(span => {
                        if (dayElement.contains(span)) {
                            span.classList.add('selected-event');
                            choosedElement = span; // Actualizar el elemento seleccionado
                        }
                    });

                    if(choosedElement) {
                        displayEventInfo(eventThisDay)
                    } else {
                        displayEvents();
                    }
                }
            });
        });
        

        daysContainer.appendChild(dayElement);
    }

    const totalCells = firstDay + daysInMonth;
    const emptyCellToAdd = 42 - totalCells;
    for (let i = 0; i < emptyCellToAdd; i++) {
        const emptyCell = document.createElement('div');
        daysContainer.appendChild(emptyCell);
    }
}


function displayEvents() {
    const eventContainer = document.getElementById('eventList');
    if (!eventContainer) return;

    eventContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar eventos

    // Añadir el título de "Upcoming Events" solo una vez
    const titleElement = document.createElement('div');
    titleElement.classList.add('upcoming-events');
    titleElement.textContent = 'Upcoming Events';
    eventContainer.appendChild(titleElement);

    const currentDate = new Date();
    const displayedEvents = new Set();

    eventData.forEach(event => {
        const startDateTime = new Date(event.fieldData['start-date-time']);
        const uniqueKey = event.fieldData.id || `${event.fieldData.name}-${startDateTime}`;

        if (startDateTime >= currentDate && !displayedEvents.has(uniqueKey)) {
            hasFutureEvents = true;
            displayedEvents.add(uniqueKey);

            const eventElement = document.createElement('div');
            eventElement.classList.add('event-item');

            const { name, description, location, 'start-date-time': startDate, 'end-date-time': endDate, image } = event.fieldData;

            const formattedStartDate = formatDateTime(new Date(startDate));
            const formattedEndTime = formatDateTime(new Date(endDate)).split(", ")[1];

            eventElement.innerHTML = `
                <div class="container-info-event">
                    <img src="${image.url}" alt="${image.alt || name}">
                    <div class="data-event">
                        <p>${formattedStartDate} - ${formattedEndTime}</p>
                        <p class="title-place">${location}</p>
                        <div class="data-description">${description}</div>
                    </div>
                </div>
            `;

            eventContainer.appendChild(eventElement);
        }
    });

    if (!hasFutureEvents) {
        const noEventsMessage = document.createElement('div');
        noEventsMessage.classList.add('no-events-message');
        noEventsMessage.textContent = 'Stay tuned. More events to come!';
        eventContainer.appendChild(noEventsMessage);
    }
}



// Inicializar el calendario y cargar eventos
function changeMonth(step) {
    currentDate.setMonth(currentDate.getMonth() + step);
    renderCalendar();
}

// Mostrar eventos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    displayEvents(); 
    renderCalendar();
});

const checkSiblings = (el_1, el_2) => el_1.contains(el_2);

