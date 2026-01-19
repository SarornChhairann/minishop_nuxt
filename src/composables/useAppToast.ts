import type { Notification } from '#ui/types'

export function useAppToast() {
    const toast = useToast()

    const showToast = (
        message: string, 
        type: 'success' | 'error' | 'info' | 'warning' = 'info', 
        timeout: number = 3000,
        options?: Partial<Notification>
    ) => {
        const colorMap: Record<'success' | 'error' | 'info' | 'warning', Notification['color']> = {
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
            const notification = toast.add({
                title: message,
                color: colorMap[type],
                icon: iconMap[type],
                timeout,
                ...options
            })
            
            return notification.id // Return the ID for potential programmatic removal
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
    const removeToast = (id: string) => {
        if (toast?.remove) {
            toast.remove(id)
        }
    }

    const appToast = {
        success: (message: string, timeout?: number, options?: Partial<Notification>) => 
            showToast(message, 'success', timeout, options),
        error: (message: string, timeout?: number, options?: Partial<Notification>) => 
            showToast(message, 'error', timeout, options),
        info: (message: string, timeout?: number, options?: Partial<Notification>) => 
            showToast(message, 'info', timeout, options),
        warning: (message: string, timeout?: number, options?: Partial<Notification>) => 
            showToast(message, 'warning', timeout, options),
        remove: removeToast
    }

    return {
        toast: appToast
    }
}

// Type definition for better TypeScript support
export type AppToast = ReturnType<typeof useAppToast>['toast']
