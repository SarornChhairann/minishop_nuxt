
export const productService = {
    async getProducts({status, search} : {status?: string, search?: string}) {
        const query: any = {};
        if (status && status.toLowerCase() !== 'all') query.status = status;
        if (search) query.search = search;
        
        return await $fetch('/api/products', { query });
    },

    async getProduct(id: number) {
        return await $fetch(`/api/products/${id}`);
    },

    async createProduct(productData: FormData) {
        return await $fetch('/api/products', {
            method: 'POST',
            body: productData
        });
    },

    async updateProduct(id: number, productData: FormData) {
        return await $fetch(`/api/products/${id}`, {
            method: 'PUT',
            body: productData
        });
    },

    async deleteProduct(id: number) {
        return await $fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });
    },
}

export const orderService = {
    async createOrder(orderData: any) {
        return await $fetch('/api/orders', {
            method: 'POST',
            body: orderData
        });
    },

    async getOrder(id: number) {
        return await $fetch(`/api/orders/${id}`);
    },
}

export default {
    ...productService,
    ...orderService
}
