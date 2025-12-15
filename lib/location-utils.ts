export function createLocationSlug(city: string, state: string){
    if(!city || !state) return "";

    const citySlug = city.toLocaleLowerCase().replace(/\s+/g, "-");
    const stateSlug = state.toLocaleLowerCase().replace(/\s+/g, "-");

    return `${citySlug}-${stateSlug}`
}