const reducer = (state, action) => {
  if (action.type === "START_LOADING") {
    return { ...state, loading: true };
  }
  if (action.type === "END_LOADING") {
    return { ...state, loading: false };
  }
  if (action.type === "SET_SEARCH_TERM") {
    return { ...state, searchTerm: action.payload };
  }
  if (action.type === "SET_COCKTAIL_LIST") {
    return { ...state, cocktailList: action.payload };
  }
  if (action.type === "IS_SUBMENU_OPEN") {
    return { ...state, isSubmenuOpen: action.payload };
  }
  if (action.type === "SUBMENU_INFO") {
    return {
      ...state,
      submenuInfo: action.payload,
    };
  }
  if (action.type === "SET_FILTER_TERM") {
    let newFilterTerms = [];
    if (action.payload.check === true) {
      newFilterTerms = [...state.filterTerms, action.payload.term];
    }
    if (action.payload.check === false) {
      newFilterTerms = state.filterTerms.filter(
        (item) => item !== action.payload.term
      );
    }
    return { ...state, filterTerms: newFilterTerms };
  }
  if (action.type === "SET_FILTERED_LIST") {
    console.log(action.payload);
    return {
      ...state,
      filteredList: action.payload,
    };
  }
  if (action.type === "GET_AMOUNT") {
    const cartAmount = state.cart.reduce((total, item) => {
      return total + parseInt(item.amount);
    }, 0);
    return { ...state, cartAmount };
  }
  var newCart = [];
  if (action.type === "HANLE_CHANGE") {
    let { id, type, cocktail } = action.payload;
    const isItemInCart = state.cart.some((item) => item.id === id);
    if (type === "add" && !isItemInCart) {
      const newCocktail = { ...cocktail, amount: 1 };
      newCart = [...state.cart, newCocktail];
    } else if (type === "add" && isItemInCart) {
      type = "increase";
    }
    if (type === "increase" || type === "decrease") {
      newCart = state.cart
        .map((item) => {
          if (item.id === id) {
            if (type === "increase") {
              return { ...item, amount: item.amount + 1 };
            }
            if (type === "decrease") {
              return { ...item, amount: item.amount - 1 };
            }
          }
          return item;
        })
        .filter((item) => item.amount > 0);
    }
    return {
      ...state,
      cart: newCart,
    };
  }
  if (action.type === "REMOVE_FROM_CART") {
    return {
      ...state,
      cart: state.cart.filter((item) => item.id !== action.payload),
    };
  }
  if (action.type === "SET_MAIN_LIST") {
    return {
      ...state,
      mainList: action.payload,
    };
  }
  if (action.type === "CLEAR_CART") {
    return { ...state, cart: [] };
  }
  return console.log("ERROR!!!  " + action.type);
};

export default reducer;
