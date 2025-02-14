const API = "http://35.209.96.156";

export interface ApiResponse {
    success: boolean;
    message: string;
}

export async function postData<T>(endPoint: string, data: any): Promise<T> {

    try {
        const response = await fetch(`${API}/${endPoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result: any = await response.json();

        return result;
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}
