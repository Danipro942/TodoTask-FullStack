export const setSession = (token: string): boolean => {
    try {
        localStorage.setItem('session', token)
        return true
        
    } catch (error) {
        return false
        console.log(error)
    }
} 


export const getSession = () => {
    const getItem = localStorage.getItem('session')
    if(!getItem) return false
    return getItem
}