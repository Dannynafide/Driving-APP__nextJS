// for example for the HOME page: url = '/api/offers'
export const jsonFetcher = (url) => fetch(url).then((res) => res.json());
