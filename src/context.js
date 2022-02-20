import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";
import reducer from "./reducer";
import submenuData from "./data";

// SearchForm.js den gelen elementin section search
// classına sahip tagde onmouseoverda bulunan closeSubMenu fonksiyonu section
// search classı altında mouse her html tagı değiştirdiğinde çalışıyor!!!!!

const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const AppContext = React.createContext();

const initialState = {
  loading: true,
  searchTerm: "",
  cocktailList: [],
  isSubmenuOpen: false,
  submenuInfo: { page: { page: "", links: [] }, location: {} },
  column: 2,
  filterTerms: [],
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
  // const [mainList, setMainList] = useState([]);
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
        console.log(newDrinks);
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
    dispatch({ type: "SET_FILTER_TERM", payload: { term, check } });
    filterList(filterTitle, term, check);
  };

  const filterList = (filterTitle, term, check) => {
    // işaretli bütün checkbox özelliklerinden en az birine sahip bütün
    // ürünler arasından sadece search barda yazılı olan stringe sahip
    // olan ürünleri getirir.
    let newCocktailList = [...mainList];
    let cocktailList = [...mainList];
    if (filterTitle === "reset_filter") {
      console.log("hello");
      console.log(mainList);
      return dispatch({
        type: "SET_COCKTAIL_LIST",
        payload: mainList,
      });
    }
    console.log(filterTerms);
    if (term && check) {
      if (filterTerms.length !== 0) {
        const list = mainList.filter((item) => item[filterTitle] === term);
        console.log(filterTerms);
        cocktailList = [...new Set([...list, ...filteredList])];
        setFilteredList([...new Set([...list, ...filteredList])]);
      } else {
        cocktailList = mainList.filter((item) => item[filterTitle] === term);
        setFilteredList(cocktailList);
      }
      console.log(cocktailList);
    } else if (term && !check && filterTerms.length > 1) {
      cocktailList = filteredList.filter((item) => item[filterTitle] !== term);
      setFilteredList(cocktailList);
    } else if (!term && filterTerms.length > 0) {
      cocktailList = [...filteredList];
      console.log(cocktailList);
    }
    if (searchTerm) {
      newCocktailList = cocktailList.filter((item) => {
        const { name } = item;
        for (let i = 0; i < name.length; i++) {
          if (
            name.substring(i, i + searchTerm.length).toLowerCase() ===
            searchTerm.toLowerCase()
          ) {
            console.log(searchTerm);
            return item;
          }
        }
      });
      console.log(newCocktailList);
    } else {
      newCocktailList = [...cocktailList];
    }
    if (!term && !searchTerm) {
      newCocktailList = [...cocktailList];
    }

    console.log(filteredList);
    console.log(newCocktailList);
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

      // getLocalStorage();
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
