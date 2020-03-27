import React, { useState, useEffect, useContext } from 'react';
import { getUserPreferences } from '../services/user-preferences';
import { UserContext } from './user-context';

type SearchContextInterface = {
  query: string,
  entityNames: string[],
  start: number,
  pageNumber: number,
  pageLength: number,
  pageSize: number,
  searchFacets: any,
  maxRowsPerPage: number
}

const defaultSearchOptions = {
  query: '',
  entityNames: [],
  start: 1,
  pageNumber: 1,
  pageLength: 20,
  pageSize: 20,
  searchFacets: {},
  maxRowsPerPage: 100
}

interface ISearchContextInterface {
  searchOptions: SearchContextInterface;
  checkedOptions: SearchContextInterface;

  setSearchFromUserPref: (username: string) => void;
  setQuery: (searchString: string) => void;
  setPage: (pageNumber: number, totalDocuments: number) => void;
  setPageLength: (current: number, pageSize: number) => void;
  setSearchFacets: (constraint: string, vals: string[]) => void;
  setEntity: (option: string) => void;
  setEntityClearQuery: (option: string) => void;
  setLatestJobFacet: (vals: string, option: string) => void;
  clearFacet: (constraint: string, val: string) => void;
  clearAllFacets: () => void;
  clearDateFacet: () => void;
  clearRangeFacet: (range: string) => void;
  resetSearchOptions: () => void;
  setAllSearchFacets: (facets: any) => void;
    setAllCheckedOptions: (facets: any) => void;
    clearCheckedFacet: (constraint: string, val: string) => void;
    clearAllCheckedFacets: () => void;
    resetCheckedOptions: () => void;




}

export const SearchContext = React.createContext<ISearchContextInterface>({
  searchOptions: defaultSearchOptions,
    checkedOptions: defaultSearchOptions,
    setSearchFromUserPref: () => { },
  setQuery: () => { },
  setPage: () => { },
  setPageLength: () => { },
  setSearchFacets: () => { },
  setEntity: () => { },
  setEntityClearQuery: () => { },
  setLatestJobFacet: () => { },
  clearFacet: () => { },
  clearAllFacets: () => { },
  clearDateFacet: () => { },
  clearRangeFacet: () => { },
  resetSearchOptions: () => { },
    resetCheckedOptions: () => { },

    setAllSearchFacets: () => { },
    setAllCheckedOptions: () => {},
    clearCheckedFacet: () => { },
    clearAllCheckedFacets: () => { },


});

const SearchProvider: React.FC<{ children: any }> = ({ children }) => {

  const [searchOptions, setSearchOptions] = useState<SearchContextInterface>(defaultSearchOptions);
    const [checkedOptions, setCheckedOptions] = useState<SearchContextInterface>(defaultSearchOptions);
    const [grey, setGrey] = useState<any[]>([]);


    const { user } = useContext(UserContext);

  const setSearchFromUserPref = (username: string) => {
    let userPreferences = getUserPreferences(username);
    if (userPreferences) {
      let values = JSON.parse(userPreferences);
      setSearchOptions({
        ...searchOptions,
        start: 1,
        pageNumber: 1,
        query: values.query.searchStr,
        entityNames: values.query.entityNames,
        searchFacets: values.query.facets,
        pageLength: values.pageLength
      });
    }
  }

  const setQuery = (searchString: string) => {
    setSearchOptions({
      ...searchOptions,
      start: 1,
      query: searchString,
      pageNumber: 1,
      pageLength: searchOptions.pageSize
    });
  }

  const setPage = (pageNumber: number, totalDocuments: number) => {
    let pageLength = searchOptions.pageSize;
    let start = pageNumber === 1 ? 1 : (pageNumber - 1) * searchOptions.pageSize + 1;

    if ((totalDocuments - ((pageNumber - 1) * searchOptions.pageSize)) < searchOptions.pageSize) {
      pageLength = (totalDocuments - ((pageNumber - 1) * searchOptions.pageLength))
    }
    setSearchOptions({
      ...searchOptions,
      start,
      pageNumber,
      pageLength
    });
  }

  const setPageLength = (current: number, pageSize: number) => {
    setSearchOptions({
      ...searchOptions,
      start: 1,
      pageNumber: 1,
      pageLength: pageSize,
      pageSize
    });
  }

  const setSearchFacets = (constraint: string, vals: string[]) => {
    let facets = {};
    if (vals.length > 0) {
      facets = { ...searchOptions.searchFacets, [constraint]: vals };
    } else {
      facets = { ...searchOptions.searchFacets };
      delete facets[constraint];
    }
    setSearchOptions({
      ...searchOptions,
      start: 1,
      searchFacets: facets,
      pageNumber: 1,
      pageLength: searchOptions.pageSize
    });
  }

  const setEntity = (option: string) => {
    let entityOptions = option ? [option] : [];
    setSearchOptions({
      ...searchOptions,
      start: 1,
      searchFacets: {},
      entityNames: entityOptions,
      pageLength: searchOptions.pageSize
    });
  }

  const setEntityClearQuery = (option: string) => {
    setSearchOptions({
      ...searchOptions,
      query: '',
      start: 1,
      searchFacets: {},
      entityNames: [option],
      pageNumber: 1,
      pageLength: searchOptions.pageSize,
    });
  }

  const setLatestJobFacet = (vals: string, option: string) => {
    let facets = {};
    facets = { createdByJob: {dataType: "string", stringValues: [vals]} };
    setSearchOptions({
      ...searchOptions,
      start: 1,
      searchFacets: facets,
      entityNames: [option],
      pageNumber: 1,
      pageLength: searchOptions.pageSize
    });
  }

  const clearFacet = (constraint: string, val: string) => {
      console.log("debug - clearing - searchoptions.searchFacets", searchOptions.searchFacets, "constraint", constraint, "Val", val)

      let facets = searchOptions.searchFacets;
    let valueKey = '';
    if (facets[constraint].dataType === 'xs:string' || facets[constraint].dataType === 'string') {
      valueKey = 'stringValues';
    }
    if (facets[constraint][valueKey].length > 1) {
      facets[constraint][valueKey] = facets[constraint][valueKey].filter(option => option !== val);
    } else {
      delete facets[constraint]
    }

      console.log("debug - clearing - later - facets", facets, "constraint", constraint, "Val", val)
      setSearchOptions({ ...searchOptions, searchFacets: facets })
      console.log("debug - clearing - later - searchoptions.searchFacets", searchOptions.searchFacets, "constraint", constraint, "Val", val)

  }

    const clearCheckedFacet = (constraint: string, val: string) => {
      console.log("debug - clearing", checkedOptions.searchFacets, "constraint", constraint, "Val", val)
        let facets = checkedOptions.searchFacets;
        let valueKey = '';
        if (facets[constraint].dataType === 'xs:string' || facets[constraint].dataType === 'string') {
            valueKey = 'stringValues';
        }
        if (facets[constraint][valueKey].length > 1) {
            facets[constraint][valueKey] = facets[constraint][valueKey].filter(option => option !== val);
        } else {
            delete facets[constraint]
        }
      //  console.log("debug - clearing - later - clearOptions.searchFacets", facets, "constraint", constraint, "Val", val)
        console.log("debug - clearing - later - facets", facets, "constraint", constraint, "Val", val)
        setCheckedOptions({ ...checkedOptions, searchFacets: facets })
        console.log("debug - clearing - later - clearOptions.searchFacets", checkedOptions.searchFacets, "constraint", constraint, "Val", val)

        //resetCheckedOptions();

    }

  const clearAllFacets = () => {
    setSearchOptions({
      ...searchOptions,
      searchFacets: {},
      start: 1,
      pageNumber: 1,
      pageLength: searchOptions.pageSize
    });
      clearAllCheckedFacets();
  }

    const clearAllCheckedFacets = () => {
        setCheckedOptions({
            ...checkedOptions,
            searchFacets: {},
            start: 1,
            pageNumber: 1,
            pageLength: checkedOptions.pageSize
        });
        resetCheckedOptions();
    }

/*
  const setDateFacet = (dates) => {
   setSearchOptions({
      ...searchOptions,
      start: 1,
      pageNumber: 1,
      pageLength: searchOptions.pageSize,
      searchFacets: {
        ...searchOptions.searchFacets,
        createdOnRange: dates
      }
    });
  }
*/

  const clearDateFacet = () => {
    let facets = searchOptions.searchFacets;
    if (facets.hasOwnProperty('createdOnRange')) {
      delete facets.createdOnRange;
      setSearchOptions({
        ...searchOptions,
        searchFacets: facets,
        start: 1,
        pageNumber: 1,
        pageLength: searchOptions.pageSize
      });
    }
  }

  const clearRangeFacet = (range: string) => {
    let facets = searchOptions.searchFacets;
    let constraints = Object.keys(facets)
    constraints.forEach(facet => {
      if (facets[facet].hasOwnProperty('rangeValues') && facet === range) {
        delete facets[facet]
      }
    });

    setSearchOptions({
      ...searchOptions,
      searchFacets: facets,
      start: 1,
      pageNumber: 1,
      pageLength: searchOptions.pageSize
    });
  }


  const resetSearchOptions = () => {
    setSearchOptions({ ...defaultSearchOptions });
  }

    const resetCheckedOptions = () => {
        setCheckedOptions({ ...defaultSearchOptions });

        console.log("debug - resetting checkedOptions.searchFacets", checkedOptions.searchFacets)
    }

  const setAllSearchFacets= (facets: any) => {
    setSearchOptions({
      ...searchOptions,
      searchFacets: facets,
      start: 1,
      pageNumber: 1,
      pageLength: searchOptions.pageSize
    });
      console.log("debug - setall search facets called , searchoptions.searchFacets", searchOptions.searchFacets)

  }

    const setAllCheckedOptions = (facets: any) => {

        setCheckedOptions({
            ...checkedOptions,
            searchFacets: facets,
            start: 1,
            pageNumber: 1,
            pageLength: checkedOptions.pageSize
        });
        console.log("debug - setall checkedoptions called , checkedOptions.searchFacets", checkedOptions.searchFacets)
    }



  useEffect(() => {
    if (user.authenticated) {
      setSearchFromUserPref(user.name);
    }
  }, [user.authenticated]);

  return (
    <SearchContext.Provider value={{
      searchOptions,
        checkedOptions,
      setSearchFromUserPref,
      setQuery,
      setPage,
      setPageLength,
      setSearchFacets,
      setEntity,
      setEntityClearQuery,
      clearFacet,
      clearAllFacets,
      setLatestJobFacet,
      clearDateFacet,
      clearRangeFacet,
      resetSearchOptions,
      setAllSearchFacets,
        setAllCheckedOptions,
        clearCheckedFacet,
        clearAllCheckedFacets,
        resetCheckedOptions


    }}>
      {children}
    </SearchContext.Provider>
  )
}

export default SearchProvider;
