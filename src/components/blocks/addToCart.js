import React, { useContext, useState, useEffect } from "react";
import AppContext from "../../globalState";

export default function AddToCartButton({ project, updatebasket }) {
  const myContext = useContext(AppContext);
  const basket = myContext.basket;
  const [buttonText, setButtonText] = useState("Add to cart");
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    ///renders when new SinglePost Project is loaded
    setButtonText("Add to cart");
    setIsInCart(false);

    if (basket) {
      for (let index = 0; index < basket.length; index++) {
        const basketproject = basket[index];
        if (basketproject.title === project.title) {
          setButtonText("Remove from cart");
          setIsInCart(true);
        }
      }
    }
  }, [basket, project]);

  function onClick() {
    var newBasket = basket;
    if (isInCart === false) {
      newBasket.push(project);
      myContext.setBasket(newBasket);
      setIsInCart(true);
      setButtonText("Remove from cart");
    } else if (isInCart === true) {
      newBasket = basket;
      for (let index = 0; index < basket.length; index++) {
        const basketproject = basket[index];
        if (basketproject.title === project.title) {
          newBasket.splice(index, 1);
          myContext.setBasket(newBasket);
        }
      }
      setIsInCart(false);
      setButtonText("Add to cart");
    }
    if (buttonText === "Add to cart") {
      updatebasket(project.title.toUpperCase() + " was added to your cart.");
    } else {
      updatebasket("remove");
    }
  }

  return (
    <button
      onClick={onClick}
      className={
        buttonText === "Add to cart"
          ? `addToCartButton `
          : `addToCartButton grey`
      }
    >
      {buttonText}
    </button>
  );
}
