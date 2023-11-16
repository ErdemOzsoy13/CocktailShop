import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";
import reducer from "./reducer";
import submenuData from "./data";

const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const AppContext = React.createContext();

const initialState = {
  loading: true,
  searchTerm: "",
  cocktailList: [],
  isSubmenuOpen: false,
  submenuInfo: { page: { page: "", links: [] }, location: {} },
  column: 2,
  filterTerms: { info: [], category: [], glass: [] },
  cart: [],
  cartAmount: 0,
  mainList: [],
};

if (localStorage.cocktail_list) {
  const cocktail_list_item = localStorage.getItem("cocktail_list");
  const cocktail_list = JSON.parse(cocktail_list_item);
  initialState.mainList = cocktail_list;
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { searchTerm, filterTerms, cart, mainList } = state;
  const [filteredList, setFilteredList] = useState([]);

  const getLocalStorage = useCallback(() => {
    const cocktail_list_item = localStorage.getItem("cocktail_list");
    const cocktail_list = JSON.parse(cocktail_list_item);
    dispatch({
      type: "SET_COCKTAIL_LIST",
      payload: cocktail_list,
    });
    setMainList(cocktail_list);
    dispatch({ type: "END_LOADING" });
  }, [localStorage.cocktail_list]);

  const fetchData = useCallback(async () => {
    dispatch({ type: "START_LOADING" });
    try {
      const response = await fetch(`${url}`);
      const data = await response.json();
      const { drinks } = data;
      if (drinks) {
        const newDrinks = drinks.map((item) => {
          const {
            idDrink: id,
            strDrink: name,
            strDrinkThumb: image,
            strAlcoholic: info,
            strGlass: glass,
            strCategory: category,
          } = item;
          return {
            id,
            name,
            image,
            info,
            glass,
            category,
          };
        });
        localStorage.setItem("cocktail_list", JSON.stringify(newDrinks));
        dispatch({ type: "SET_COCKTAIL_LIST", payload: newDrinks });
        setMainList(newDrinks);
      } else {
        dispatch({ type: "SET_COCKTAIL_LIST", payload: [] });
      }
      dispatch({ type: "END_LOADING" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "END_LOADING" });
    }
  }, []);

  const setSearchTerm = (searchText) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: searchText });
  };

  const openSubmenu = (text, location) => {
    const page = submenuData.find((item) => {
      return item.page === text;
    });
    dispatch({ type: "SUBMENU_INFO", payload: { page, location } });
    dispatch({ type: "IS_SUBMENU_OPEN", payload: true });
  };

  const closeSubmenu = () => {
    dispatch({ type: "IS_SUBMENU_OPEN", payload: false });
  };

  const setFilterTerms = (filterTitle, term, check) => {
    dispatch({
      type: "SET_FILTER_TERM",
      payload: { filterTitle, term, check },
    });
    filterList(filterTitle, term, check);
  };

  const filterList = (filterTitle, term, check) => {
    // işaretli bütün checkbox özelliklerinden en az birine sahip bütün
    // ürünler arasından sadece search barda yazılı olan stringe sahip
    // olan ürünleri getirir.
    let cocktailList = [...mainList];
    let newCocktailList = [];
    if (filterTitle === "reset_filter") {
      return dispatch({
        type: "SET_COCKTAIL_LIST",
        payload: mainList,
      });
    }

    if (searchTerm) {
      cocktailList = mainList.filter((item) => {
        const { name } = item;
        for (let i = 0; i < name.length; i++) {
          if (
            name.substring(i, i + searchTerm.length).toLowerCase() ===
            searchTerm.toLowerCase()
          ) {
            return item;
          }
        }
      });
    }
    let isFilterExist = false;
    let newFilterTerms = { ...filterTerms };
    if (term) {
      if (check) {
        isFilterExist = true;
        newFilterTerms = {
          ...filterTerms,
          [filterTitle]: [...filterTerms[filterTitle], term],
        };
      } else {
        let abc = filterTerms[filterTitle].filter((item) => {
          if (item !== term) {
            return item;
          }
        });
        newFilterTerms = { ...filterTerms, [filterTitle]: abc };
        for (const prop in newFilterTerms) {
          if (newFilterTerms[prop].length !== 0) {
            isFilterExist = true;
          }
        }
      }
    } else {
      for (const prop in filterTerms) {
        if (filterTerms[prop].length !== 0) {
          isFilterExist = true;
        }
      }
    }
    let cocktailListPart = [];
    if (isFilterExist) {
      for (let prop in newFilterTerms) {
        if (newFilterTerms[prop].length !== 0) {
          cocktailListPart = cocktailList.filter((item) => {
            for (let i = 0; i < newFilterTerms[prop].length; i++) {
              if (item[prop] === newFilterTerms[prop][i]) {
                return item;
              }
            }
          });
          newCocktailList = [
            ...new Set([...newCocktailList, ...cocktailListPart]),
          ];
        }
      }
    } else {
      newCocktailList = [...cocktailList];
    }
    setFilteredList(newCocktailList);
    dispatch({ type: "SET_COCKTAIL_LIST", payload: newCocktailList });
  };

  const handleChange = (id, type, cocktail) => {
    dispatch({ type: "HANLE_CHANGE", payload: { id, type, cocktail } });
  };

  const remove = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const setMainList = (list) => {
    dispatch({ type: "SET_MAIN_LIST", payload: list });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  useEffect(() => {
    dispatch({ type: "GET_AMOUNT" });
  }, [cart]);

  useEffect(() => {
    filterList();
  }, [searchTerm]);

  useEffect(() => {
    if (!localStorage.cocktail_list) {
      fetchData();
    } else {
      dispatch({ type: "END_LOADING" });
    }
    setFilteredList([]);
  }, [fetchData, getLocalStorage]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setSearchTerm,
        openSubmenu,
        closeSubmenu,
        setFilterTerms,
        filterList,
        setFilteredList,
        handleChange,
        remove,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useGlobalContext };
