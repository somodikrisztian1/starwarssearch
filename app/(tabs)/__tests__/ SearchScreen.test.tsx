import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SearchScreen from '../../../app/(tabs)/index';
import { fetchStarWarsCharacters } from '../../../services/swapi';

jest.mock('../../../services/swapi');

const mockFetchStarWarsCharacters = fetchStarWarsCharacters as jest.MockedFunction<typeof fetchStarWarsCharacters>;

describe('SearchScreen', () => {
  beforeEach(() => {
    mockFetchStarWarsCharacters.mockClear();
  });

  it('should update state with search results', async () => {
    const mockResults = [
      { name: 'Luke Skywalker', height: '172', mass: '77', gender: 'male' },
      { name: 'Darth Vader', height: '202', mass: '136', gender: 'male' },
    ];
    mockFetchStarWarsCharacters.mockResolvedValue(mockResults);

    const { getByPlaceholderText, getByText, queryByText } = render(<SearchScreen />);

    const searchInput = getByPlaceholderText('Search for a character');
    const searchButton = getByText('Search');

    fireEvent.changeText(searchInput, 'Luke');
    fireEvent.press(searchButton);

    await waitFor(() => {
      expect(mockFetchStarWarsCharacters).toHaveBeenCalledWith('Luke');
    });
  });

  it('should handle empty search results', async () => {
    const mockResults = [];
    mockFetchStarWarsCharacters.mockResolvedValue(mockResults);

    const { getByPlaceholderText, getByText, queryByText } = render(<SearchScreen />);

    const searchInput = getByPlaceholderText('Search for a character');
    const searchButton = getByText('Search');

    fireEvent.changeText(searchInput, 'Unknown Character');
    fireEvent.press(searchButton);

    await waitFor(() => {
      expect(mockFetchStarWarsCharacters).toHaveBeenCalledWith('Unknown Character');
    });
  });
});