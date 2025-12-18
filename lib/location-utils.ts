import {City, State} from 'country-state-city'

export function createLocationSlug(city: string, state: string){
    if(!city || !state) return "";

    const citySlug = city.toLocaleLowerCase().replace(/\s+/g, "-");
    const stateSlug = state.toLocaleLowerCase().replace(/\s+/g, "-");

    return `${citySlug}-${stateSlug}`
}

export function parseLocationSlug(slug: string) {
    if (!slug || typeof slug !== "string") return {city: null, state: null, isValid: false};

    const parts = slug.split("-");

    if (parts.length < 2) return {city:null, state: null, isValid: false};

    const cityName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);

    const stateName = parts
        .slice(1)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" "); 

    
    const indianState = State.getStatesOfCountry("IN");

    const stateObj = indianState.find(
        (s) => s.name.toLocaleLowerCase() === stateName.toLocaleLowerCase()
    )

    if (!stateObj) return {city: null, state: null, isValid: false};

    const cities = City.getCitiesOfState("IN", stateObj.isoCode);
    const cityExists = cities.some(
        (c) => c.name.toLowerCase() === cityName.toLocaleLowerCase()
    );

    if(!cityExists) return {city: null, state:null, isValid: false};

    return {city: cityName, state: stateName, isValid: true}
}