export default async function handler(req, res) {
    const apiUrl = 'https://api.webflow.com/v2/collections/672bd0fda2167383e4d01e39/items';
    const token = process.env.API_TOKEN; 

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            res.status(response.status).json({ error: errorData });
            return;
        }

        const data = await response.json();
        res.status(200).json(data); // Envía los datos al cliente
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
