export const baseUrl = () => {
    return import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api"
}