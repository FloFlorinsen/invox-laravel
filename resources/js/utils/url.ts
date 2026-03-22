const basePath = import.meta.env.VITE_BASE_PATH || ''

export const prefixUrl = (url: string): string => {
    if (basePath && url.startsWith('/') && !url.startsWith(basePath)) {
        return basePath + url
    }
    return url
}
