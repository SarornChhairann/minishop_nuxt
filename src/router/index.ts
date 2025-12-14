import {createRouter, createWebHistory} from 'vue-router'

const HomeView = () => import('../views/HomeView.vue')
const ProductDetail = () => import('../views/ProductDetail.vue')
const CartView = () => import('../views/CartView.vue')
const CheckoutView = () => import('../views/CheckoutView.vue')
const OrderConfirmation = () => import('../views/OrderConfirmation.vue')
const AdminProducts = () => import('../views/admin/ProductsView.vue')
const AdminProductForm = () => import('../views/admin/ProductForm.vue')

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/product/:id',
        name: 'ProductDetail',
        component: ProductDetail,
        props: true
    },
    {
        path: '/cart',
        name: 'Cart',
        component: CartView
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: CheckoutView
    },
    {
        path: '/order-confirmation/:id',
        name: 'OrderConfirmation',
        component: OrderConfirmation,
        props: true
    },
    {
        path: '/admin',
        name: 'AdminProducts',
        component: AdminProducts
    },
    {
        path: '/admin/product/new',
        name: 'NewProduct',
        component: AdminProductForm
    },
    {
        path: '/admin/product/edit/:id',
        name: 'EditProduct',
        component: AdminProductForm,
        props: true
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router