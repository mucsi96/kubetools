export async function fetchJSON(url, options) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error('Fetch error');
    }

    const data = await response.json();

    return data;
}