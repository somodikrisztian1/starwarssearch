export const fetchStarWarsCharacters = async (name: string) => {
  const response = await fetch(`https://swapi.dev/api/people/?search=${name}`);
  const data = await response.json();
  return data.results;
};