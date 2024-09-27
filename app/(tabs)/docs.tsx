import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';

const markdownContent = `
### Documentation: Design and Implementation of Star Wars Character Search

#### 1. **Project Setup**
   - **Languages and Frameworks**: TypeScript, React, React Native.
   - **Dependencies**:
     - \`react-native-table-component\` for table display.
     - \`lodash\` for utility functions.
     - \`react-native-picker-select\` for dropdown selection.
     - \`react-native-safe-area-context\` for safe area handling.

#### 2. **State Management**
   - **Initial State**:
     \`\`\`typescript
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
     \`\`\`
   - **Reducer Function**: Handles state transitions based on action types (\`SET_QUERY\`, \`SET_RESULTS\`, \`SET_SORT\`, etc.).

#### 3. **Components**
   - **SearchScreen**: Main component handling the search functionality.
     - **useReducer**: Manages the state using the reducer function.
     - **useState**: Manages additional results.
     - **useEffect**: Resets state on component mount.

#### 4. **Functions**
   - **handleSearch**: Fetches Star Wars characters based on the search query and updates the state.
   - **handleSort**: Sorts the results based on the selected field and order.
   - **handlePageSizeChange**: Updates the page size and triggers a new search.
   - **handlePageChange**: Handles pagination by updating the current page and triggering a new search.

#### 5. **Rendering**
   - **Table Header**: Rendered using \`renderTableHeader\` function, allowing sorting by column headers.
   - **Table Data**: Displayed using \`Table\`, \`Row\`, and \`Rows\` components from \`react-native-table-component\`.
   - **Pagination**: Handled using \`Button\` components for navigating between pages.
   - **Results Display**: Uses \`FlatList\` to display union and intersection results.

#### 6. **Styling**
   - **Styles**: Defined using \`StyleSheet.create\` for consistent styling across components.
     \`\`\`typescript
     const styles = StyleSheet.create({
       container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
       screenHeader: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
       input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 12, paddingHorizontal: 8, backgroundColor: '#fff' },
       searchButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
       buttonText: { color: '#fff', fontSize: 16 },
       picker: { height: 50, width: 150 },
       tableContainer: { flex: 1, paddingHorizontal: 16 },
       head: { height: 40, backgroundColor: '#f1f8ff' },
       text: { margin: 6 },
       pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, paddingHorizontal: 16 },
       pageNumber: { fontSize: 16 },
       firstCharacter: { marginTop: 20, padding: 10, backgroundColor: '#e0e0e0', borderRadius: 8, marginHorizontal: 16 },
       firstCharacterText: { fontSize: 16, fontWeight: 'bold' },
       header: { fontSize: 18, fontWeight: 'bold', marginVertical: 10, marginHorizontal: 16 },
       item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: '#fff', borderRadius: 8, marginVertical: 5, marginHorizontal: 16 },
       itemText: { fontSize: 16 },
       headerCell: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
       headerText: { fontWeight: 'bold' },
       sortIndicator: { marginLeft: 4 },
     });
     \`\`\`

#### 7. **TypeScript Enhancements**
   - **Type Declarations**: Ensure all parameters and state properties have explicit types.
   - **Module Declarations**: Add custom type declarations for missing modules (\`react-native-table-component\`, \`lodash\`).

#### 8. **Error Handling**
   - **TypeScript Errors**: Address missing type declarations and implicit \`any\` types by installing type definitions or adding custom declarations.
`;

export default function DocsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Markdown style={markdownStyles}>{markdownContent}</Markdown>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
});

const markdownStyles = {
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#777',
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  code: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    color: '#d6336c',
  },
  listItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
};