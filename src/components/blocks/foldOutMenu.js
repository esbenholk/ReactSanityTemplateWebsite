import React from "react";
import BasketCard from "./basketCard";

const EmptyCart = (props) => {
  return (
    <>
      <h2>Your cart is empty.</h2>
      <p>
        If your want to contact me without project references{" "}
        <a href={"mailto:" + props.email}>Send email now</a>
      </p>
    </>
  );
};

const FullCart = (props) => {
  return (
    <>
      <h2>Something catches your eye! Wanna drop a line?</h2>
    </>
  );
};

class FoldOutMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectList: [],
      isOpen: this.props.isOpen,
    };
  }
  componentDidMount() {
    console.log("foldoutmenu mounts");
  }

  componentDidUpdate() {
    console.log("foldoutmenu updates");
  }
  handleClick = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    var projectList;
    if (this.props.projectList) {
      projectList = [this.props.projectList[0], this.props.projectList[1]];
    }
    return (
      <div>
        <div
          className={this.state.isOpen ? "overlay active" : "overlay"}
          // onClick={this.props.openMenu}
        ></div>
        <div className={this.state.isOpen ? "foldout active" : "foldout"}>
          <div className="foldoutmenu">
            <div className="foldoutHeader foldoutDiv">
              <img
                src="../assets/CloseCross.svg"
                className="closeCross"
                alt="down arrow button"
              />
              {this.props.basket.length === 0 ? (
                <EmptyCart email={this.props.info.email} />
              ) : (
                <FullCart />
              )}
            </div>
            <div className="foldoutDiv">
              {this.props.basket.length === 0 ? (
                <>
                  {" "}
                  <h1>Others have looked at</h1>
                  {projectList ? (
                    <div className="flex-column">
                      {projectList.map((post, index) => (
                        <BasketCard post={post} key={index} />
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  {" "}
                  <h2>Your cart</h2>
                  {this.props.basket ? (
                    <div className="flex-column">
                      {this.props.basket.map((post, index) => (
                        <BasketCard
                          post={post}
                          key={index}
                          isInCart={true}
                          removeFromCart={this.props.removeFromCart}
                        />
                      ))}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FoldOutMenu;

{
  /* <FoldOutMenu
          openMenu={openMenu}
          isOpen={isOpen}
          basket={basket}
          projectList={projectList}
          info={info}
          removeFromCart={removeFromCart}
        /> */
}
