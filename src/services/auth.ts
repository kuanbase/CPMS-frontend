import request from 'umi-request'

export async function getToken() {
    return request.post('https://localhost:7176/api/Auth/GetToken', {
        data: { email: 'admin@city.com', password: 'Admin@12345' },
        headers: {
          'Content-Type': 'application/json',
        },
    });
}