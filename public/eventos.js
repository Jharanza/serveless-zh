let eventData = [];


async function dateEvents(apiUrl, token) {

    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept-Version': '1.0.0'
        }
    });

    if (!response.ok) throw new Error('Failed to fetch events');

    return await response.json()
}

async function loadEvents() {
    try {

        const response = await fetch('/api/fetch-events')

        if (!response.ok) throw new Error('Failed to fetch events from serverless API');
        
        const events = await response.json()
        eventData = events.items;
        
        displayEvents();
    } catch (e) {
        console.error(e);
    }
}

function displayEvents() {
    const currentDate = new Date();
    let closestEvent = null;

    // Ordenar eventos por fecha
    eventData.sort((a, b) => new Date(a.fieldData['start-date-time']) - new Date(b.fieldData['start-date-time']));

    // Buscar el evento actual o el más cercano en el futuro
    for (const event of eventData) {
        const eventStartDate = new Date(event.fieldData['start-date-time']);
        if (eventStartDate >= currentDate) {
            closestEvent = event;
            break;
        }
    }

    // Si no hay eventos futuros, mostrar el primer evento pasado
    if (!closestEvent && eventData.length > 0) {
        closestEvent = eventData[0];
    }

    // Mostrar el evento encontrado usando displayEventInfo
    if (closestEvent) {
        displayEventInfo(closestEvent);
    } 
    // else {
    //     const noEventsMessage = document.createElement('div');
    //     noEventsMessage.classList.add('no-events-message');
    //     noEventsMessage.textContent = 'Stay tuned. More events to come!';
    //     eventContainer.appendChild(noEventsMessage);
    // }
}


document.addEventListener('DOMContentLoaded', loadEvents);
