const API_BASE_URL = "http://127.0.0.1:7888/api";


async function postRequest(endpoint, body) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || `HTTP-Fehler ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error(`Fehler bei der Anfrage an ${endpoint}:`, error);
        throw error;
    }
}


export async function generateKeys(algorithm) {
    console.log(`API-Aufruf: /keypair für ${algorithm}`);
    return postRequest("/keypair", { algorithm });
}


export async function encapsulate(algorithm, publicKey) {
    console.log(`API-Aufruf: /encap für ${algorithm}`);
    return postRequest("/encap", { algorithm, publicKey });
}


export async function decapsulate(algorithm, ciphertext, secretKey) {
    console.log(`API-Aufruf: /decap für ${algorithm}`);
    return postRequest("/decap", { algorithm, ciphertext, secretKey });
}

export async function getSupportedAlgorithms() {
    console.log("API-Aufruf: /algorithms");
    try {
        const response = await fetch(`${API_BASE_URL}/algorithms`);
        if (!response.ok) {
            throw new Error(`HTTP-Fehler ${response.status}`);
        }
        const data = await response.json();
        return data.algorithms;
    } catch (error) {
        console.error("Fehler beim Abrufen der Algorithmen:", error);
        throw error;
    }
}
