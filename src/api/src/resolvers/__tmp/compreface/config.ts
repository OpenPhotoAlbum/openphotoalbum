export const API_URL = 'http://10.0.0.15:7000/api/v1'
export const RECOGNITION_API_KEY = 'b8ed9cce-edbb-449a-9fa4-7be06fa72f34';

export const RECOGNITION_HEADERS = {
    "x-api-key": RECOGNITION_API_KEY,
    "Content-Type": "application/json",
};

export const RECOGNITION_URL = `${API_URL}/recognition`;