import React, { useReducer, useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row, Rows } from 'react-native-table-component';
import { fetchStarWarsCharacters } from '../../services/swapi';
import { head, sortBy, unionBy, intersectionBy } from 'lodash';
import RNPickerSelect from 'react-native-picker-select';

const initialState = {
  searchQuery: '',
  results: [],
  sortField: 'name',
  sortOrder: 'asc',
  pageSize: 25,
  currentPage: 1,
  hasSearched: false,
  totalPages: 1,
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload.results, hasSearched: true, totalPages: action.payload.totalPages, loading: false };
    case 'SET_SORT':
      return { ...state, sortField: action.payload.field, sortOrder: action.payload.order };
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

export default function SearchScreen() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [additionalResults, setAdditionalResults] = useState([]);

  useEffect(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const handleSearch = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const characters = await fetchStarWarsCharacters(state.searchQuery);
    const totalPages = Math.ceil(characters.length / state.pageSize);
    dispatch({ type: 'SET_RESULTS', payload: { results: characters, totalPages } });
  };

  const handleSort = async (field: string) => {
    const order = state.sortField === field && state.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch({ type: 'SET_SORT', payload: { field, order } });
    await handleSearch();
  };

  const handlePageSizeChange = (size: number) => {
    dispatch({ type: 'SET_PAGE_SIZE', payload: size });
    handleSearch();
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    const newPage = direction === 'prev' ? state.currentPage - 1 : state.currentPage + 1;
    if (newPage > 0 && newPage <= state.totalPages) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: newPage });
      handleSearch();
    }
  };

  const renderTableHeader = () => {
    const headers = ['Name', 'Height', 'Mass', 'Gender'];
    return headers.map((header) => (
        <TouchableOpacity key={header} onPress={() => handleSort(header.toLowerCase())}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>{header}</Text>
            {state.sortField === header.toLowerCase() && (
                <Text style={styles.sortIndicator}>{state.sortOrder === 'asc' ? '↑' : '↓'}</Text>
            )}
          </View>
        </TouchableOpacity>
    ));
  };

  const sortedResults = sortBy(state.results, [state.sortField]);
  if (state.sortOrder === 'desc') sortedResults.reverse();

  const firstCharacter = head(sortedResults);
  const unionResults = unionBy(state.results, additionalResults, 'name');
  const intersectionResults = intersectionBy(state.results, additionalResults, 'name');

  const tableData = sortedResults.map((character) => [
    character.name,
    character.height,
    character.mass,
    character.gender,
  ]);

  const renderItem = ({ item }) => (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
  );

  return (
      <SafeAreaView style={styles.container}>
        <FlatList
            data={[]}
            ListHeaderComponent={
              <>
                <Text style={styles.screenHeader}>Star Wars Character Search</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Search for a character"
                    value={state.searchQuery}
                    onChangeText={(text) => dispatch({ type: 'SET_QUERY', payload: text })}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                  <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
                {state.loading && <ActivityIndicator size="large" color="#007BFF" />}
                {state.hasSearched && unionResults.length > 0 && (
                    <>
                      <RNPickerSelect
                          onValueChange={(value) => handlePageSizeChange(value)}
                          items={[
                            { label: '25', value: 25 },
                            { label: '50', value: 50 },
                            { label: '100', value: 100 },
                            { label: '150', value: 150 },
                          ]}
                          style={pickerSelectStyles}
                          value={state.pageSize}
                      />
                      <View style={styles.tableContainer}>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
                          <Row
                              data={renderTableHeader()}
                              style={styles.head}
                              textStyle={styles.text}
                          />
                          <Rows data={tableData} textStyle={styles.text} />
                        </Table>
                      </View>
                      <View style={styles.pagination}>
                        <Button title="Prev" onPress={() => handlePageChange('prev')} disabled={state.currentPage === 1} />
                        <Text style={styles.pageNumber}>Page {state.currentPage}</Text>
                        <Button title="Next" onPress={() => handlePageChange('next')} disabled={state.currentPage === state.totalPages} />
                      </View>
                      {firstCharacter && (
                          <View style={styles.firstCharacter}>
                            <Text style={styles.firstCharacterText}>First Character: {firstCharacter.name}</Text>
                          </View>
                      )}
                      {unionResults.length > 0 && (
                          <>
                            <Text style={styles.header}>Union Results:</Text>
                            <FlatList
                                data={unionResults}
                                keyExtractor={(item) => item.name}
                                renderItem={renderItem}
                            />
                          </>
                      )}
                      {intersectionResults.length > 0 && (
                          <>
                            <Text style={styles.header}>Intersection Results:</Text>
                            <FlatList
                                data={intersectionResults}
                                keyExtractor={(item) => item.name}
                                renderItem={renderItem}
                            />
                          </>
                      )}
                    </>
                )}
              </>
            }
            renderItem={null}
            keyExtractor={() => 'dummy'}
        />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  screenHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: 150,
  },
  tableContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  pageNumber: {
    fontSize: 16,
  },
  firstCharacter: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  firstCharacterText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 16,
  },
  itemText: {
    fontSize: 16,
  },
  headerCell: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerText: {
    fontWeight: 'bold',
  },
  sortIndicator: {
    marginLeft: 4,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
  },
});