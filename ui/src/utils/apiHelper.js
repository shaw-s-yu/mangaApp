export const fetchApi = async (url, method, body) => {
    try {
        const response = await fetch(url, {
            method,
            body
        })
        console.log(response)
        if (response.status !== 200) {
            alert(`failed`)
        }
        return await response.json();
    } catch (e) {
        alert(`Cannot fetch ${method} on ${url}: ${e.message}`)
    }
}