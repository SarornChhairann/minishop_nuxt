import type { ToastOptions } from '#ui/toast'

export function useAppToast() {
    const nuxtApp = useNuxtApp()
    
    // Check if $toast exists (safer access)
    const nuxtToast = nuxtApp.$toast
    
    if (!nuxtToast) {
        console.warn('NuxtUI toast not available. Make sure @nuxt/ui is properly installed and configured.')
        // Return a fallback implementation
        return {
            toast: {
                success: (message: string, timeout?: number) => console.log('✅', message),
                error: (message: string, timeout?: number) => console.error('❌', message),
                info: (message: string, timeout?: number) => console.info('ℹ️', message),
                warning: (message: string, timeout?: number) => console.warn('⚠️', message)
            }
        }
    }

    const showToast = (
        message: string, 
        type: 'success' | 'error' | 'info' | 'warning' = 'info', 
        timeout: number = 3000,
        options?: Partial<ToastOptions>
    ) => {
        const colorMap: Record<'success' | 'error' | 'info' | 'warning', string> = {
            success: 'green',
            error: 'red',
            info: 'blue',
            warning: 'yellow'
        }
        
        const iconMap = {
            success: 'i-heroicons-check-circle',
            error: 'i-heroicons-x-circle',
            info: 'i-heroicons-information-circle',
            warning: 'i-heroicons-exclamation-triangle'
        }
        
        try {
            const toastId = nuxtToast.add({
                title: message,
                color: colorMap[type],
                icon: iconMap[type],
                timeout,
                ...options
            })
            
            return toastId // Return the ID for potential programmatic removal
        } catch (error) {
            console.error('Toast error:', error)
            // Fallback to console logging
            const consoleMethods = {
                success: console.log,
                error: console.error,
                info: console.info,
                warning: console.warn
            }
            consoleMethods[type](`[Toast ${type}]: ${message}`)
            return null
        }
    }

    // Helper for removing toasts by ID
    const removeToast = (id: number) => {
        if (nuxtToast?.remove) {
            nuxtToast.remove(id)
        }
    }

    const toast = {
        success: (message: string, timeout?: number, options?: Partial<ToastOptions>) => 
            showToast(message, 'success', timeout, options),
        error: (message: string, timeout?: number, options?: Partial<ToastOptions>) => 
            showToast(message, 'error', timeout, options),
        info: (message: string, timeout?: number, options?: Partial<ToastOptions>) => 
            showToast(message, 'info', timeout, options),
        warning: (message: string, timeout?: number, options?: Partial<ToastOptions>) => 
            showToast(message, 'warning', timeout, options),
        remove: removeToast
    }

    return {
        toast
    }
}

// Type definition for better TypeScript support
export type AppToast = ReturnType<typeof useAppToast>['toast']