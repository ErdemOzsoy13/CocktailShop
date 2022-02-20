import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import CartPage from "./pages/CartPage";
import SingleCocktail from "./pages/SingleCocktail";
import Error from "./pages/Error";
import Submenu from "./components/Submenu";

function App() {
  return (
    <main>
      <Router>
        <Navbar />
        <Submenu />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/cartpage">
            <CartPage />
          </Route>
          <Route path="/cocktails/:id" children={<SingleCocktail />} />
          <Route path="*">
            <Error />
          </Route>
        </Switch>
      </Router>
    </main>
  );
}

export default App;
