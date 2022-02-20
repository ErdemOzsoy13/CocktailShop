import React from "react";
import CartItem from "../components/CartItem";
import { useGlobalContext } from "../context";

export default function CartPage() {
  const { cart, cartAmount, clearCart } = useGlobalContext();

  if (cart.length === 0) {
    return (
      <section className="cart">
        {/* cart header */}
        <header>
          <h2>your bag</h2>
          <h4 className="empty-cart">is currently empty</h4>
        </header>
      </section>
    );
  }
  return (
    <div>
      <section className="cart">
        {/* cart header */}
        <header>
          <h2>your bag</h2>
        </header>
        {/* cart items */}
        <div>
          {cart.map((item) => {
            return <CartItem key={item.id} {...item} />;
          })}
        </div>
        {/* cart footer */}
        <footer>
          <hr />
          <div className="cart-total">
            <h4>
              total amount <span>{cartAmount}</span>
            </h4>
          </div>
          <button className="btn clear-btn" onClick={clearCart}>
            clear cart
          </button>
        </footer>
      </section>
    </div>
  );
}
