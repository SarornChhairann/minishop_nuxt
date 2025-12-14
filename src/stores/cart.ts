import {defineStore} from 'pinia'
import {computed, ref} from 'vue'

export interface CartItem {
    product_id: number
    name: string
    price: number
    quantity: number
    availableStock: number
    image_url?: string
}

export const useCartStore = defineStore('cart', () => {
    const items = ref<CartItem[]>([])

    const totalItems = computed(() => {
        return items.value.reduce((sum, item) => sum + item.quantity, 0)
    })

    const totalPrice = computed(() => {
        return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    })

    function addToCart(product: CartItem) {
        const existingItem = items.value.find(item => item.product_id === product.product_id)
        if (existingItem) {
            existingItem.quantity += product.quantity
        } else {
            items.value.push({ ...product })
        }
    }

    function removeFromCart(productId: number) {
        items.value = items.value.filter(item => item.product_id !== productId)
    }

    function updateQuantity(productId: number, quantity: number) {
        const item = items.value.find(item => item.product_id === productId)
        if (item) {
            item.quantity = quantity
        }
    }

    function clearCart() {
        items.value = []
    }

    return {
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    }
})