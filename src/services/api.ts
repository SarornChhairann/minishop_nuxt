import axios from 'axios'

const api = axios.create({
    baseURL: 'https://vanny-minishop-fr2h.vercel.app/api',
    headers: {
        'Cache-Control': 'no-cache'
    }
})

export const productService = {
    async getProducts({status, search} : {status?: string, search?: string}) {
        let product = 'products';
        if(search && status){
            product += `?search=${search}&status=${status}`;
        }else if(status){
           product += `?status=${status}`;
        } else if(search){
            product += `&search=${search}`;
        }
        const response = await api.get(`${product}`);
        return response.data;
    },

    async getProduct(id: number) {
        const response = await api.get(`/products/${id}`)
        return response.data
    },

    async createProduct(productData: FormData) {
        const response = await api.post('/products', productData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    },

    async updateProduct(id: number, productData: FormData) {
        const response = await api.put(`/products/${id}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    },

    async deleteProduct(id: number) {
        const response = await api.delete(`/products/${id}`)
        return response.data;
    },
}

export const orderService = {
    async createOrder(orderData: any) {
        const response = await api.post('/orders', orderData)
        return response.data
    },

    async getOrder(id: number) {
        const response = await api.get(`/orders/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        console.log(response.data)
        return response.data
    },
}

export default api