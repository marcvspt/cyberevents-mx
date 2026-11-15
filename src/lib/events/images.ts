export function isEventRasterImage(path: string): boolean {
    return /^\/img\/events\/[^?#]+\.(?:avif|jpe?g|png|webp)$/i.test(path);
}

export function getEventImageUrl(path: string, width: number, format?: 'jpg'): string {
    const params = new URLSearchParams({ url: path, w: String(width) });
    if (format) params.set('fm', format);
    return `/.netlify/images?${params}`;
}
