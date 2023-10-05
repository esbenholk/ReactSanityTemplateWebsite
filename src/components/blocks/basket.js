import React, { useState, useContext } from "react";

import AppContext from "../../globalState";

import BasketCard from "./basketCard";

import ContactUs from "./email";

export default function Basket({
  basket,
  isBasketOpen,
  updatebasket,
  basket_message,
}) {
  const myContext = useContext(AppContext);
  const projectList = myContext.projectList;
  const info = myContext.siteSettings;
  const [emailIsOpen, setEmailIsOpen] = useState(false);

  // const [isOpen, setIsOpen] = useState();

  const EmptyCart = (mail) => {
    return (
      <>
        {basket_message ? (
          <>
            {basket_message !== "Thanks for shopping with us" ? (
              <>
                <h2>Your cart is empty.</h2>
                <p>
                  If your want to contact me without project references{" "}
                  <a href={"mailto:" + info.email}>Send email now</a>
                </p>
              </>
            ) : (
              <>
                <h2> {basket_message} </h2>

                {basket_message !== "Thanks for shopping with us" ? (
                  <></>
                ) : (
                  <>
                    <p>
                      We've delivered your cart selection to your mailbox! We
                      received your message.{" "}
                      <u
                        onClick={() => updatebasket("")}
                        className="underlined"
                      >
                        Continue browsing
                      </u>
                    </p>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <h2>Your cart is empty.</h2>
            <p>
              Add something in your cart to contact me.{" "}
              <a href={"mailto:" + info.email}>Or drop a line</a>
            </p>
          </>
        )}
      </>
    );
  };

  const FullCart = (mail) => {
    return (
      <>
        {basket_message ? (
          <>
            {basket_message !== "remove" ? (
              <>
                {" "}
                <h2>
                  {basket_message}{" "}
                  <p onClick={() => updatebasket("")} className="underlined">
                    Continue browsing
                  </p>
                </h2>{" "}
              </>
            ) : (
              <>
                <h2>Something catches your eye!</h2>
                <p>
                  Wanna drop a line? We'll get your message and your cart
                  selection, and send a copy to your inbox.
                </p>
              </>
            )}
          </>
        ) : (
          <>
            <h2>Something catches your eye!</h2>
            <p
              className="underlined"
              onClick={() => {
                setEmailIsOpen(!emailIsOpen);
                updatebasket("remove");
              }}
            >
              Contact me
            </p>
          </>
        )}
      </>
    );
  };

  function removeFromCart(project) {
    var newBasket = basket;
    for (let index = 0; index < basket.length; index++) {
      const basketproject = basket[index];
      if (basketproject.title === project.title) {
        newBasket.splice(index, 1);
        myContext.setBasket(newBasket);
        updatebasket("remove");
      }
    }
  }

  function emptyBasket() {
    var emptyBasket = [];
    myContext.setBasket(emptyBasket);
    updatebasket("Thanks for shopping with us");
    setEmailIsOpen(!emailIsOpen);
  }
  return (
    <>
      <div className="basket" onClick={() => updatebasket("")}>
        <img
          className="header-object basketIcon"
          src="\assets\awesome-shopping-cart.png"
          alt="shopping cart"
        />

        {basket && basket.length > 0 ? (
          <div className="basketCounter">
            <p>{basket.length}</p>{" "}
          </div>
        ) : null}
      </div>

      <div>
        <div
          className={isBasketOpen ? "megaOverlay active" : "overlay"}
          onClick={() => updatebasket("")}
        ></div>
        <div className={isBasketOpen ? "foldout active" : "foldout"}>
          <div className="foldoutmenu">
            <div className="foldoutHeader foldoutDiv">
              <img
                src="../assets/CloseCross.svg"
                className="closeCrossBasket"
                alt="down arrow button"
                onClick={() => updatebasket("")}
              />
              {basket.length === 0 ? (
                <EmptyCart email={info.email} />
              ) : (
                <FullCart email={info.email} />
              )}
            </div>
            <div className="foldoutDiv">
              {basket.length === 0 ? (
                <>
                  {" "}
                  <h1>Others have looked at</h1>
                  {projectList ? (
                    <div className="flex-column">
                      {projectList.map((post, index) => (
                        <>
                          {" "}
                          {post.categories[0].title === "Creative" ? (
                            <></>
                          ) : (
                            <BasketCard
                              post={post}
                              key={index}
                              openMenu={updatebasket}
                            />
                          )}
                        </>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <h2>Your cart</h2>
                  {basket ? (
                    <>
                      <div className="flex-column">
                        {basket.map((post, index) => (
                          <BasketCard
                            post={post}
                            key={index}
                            isInCart={true}
                            removeFromCart={removeFromCart}
                            openMenu={updatebasket}
                          />
                        ))}
                      </div>
                      {!emailIsOpen ? (
                        <button
                          className="addToCartButton"
                          onClick={() => {
                            setEmailIsOpen(!emailIsOpen);
                            updatebasket("remove");
                          }}
                        >
                          Contact Me
                        </button>
                      ) : null}{" "}
                      {emailIsOpen && (
                        <ContactUs basket={basket} emptyBasket={emptyBasket} />
                      )}
                    </>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
