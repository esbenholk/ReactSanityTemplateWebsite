import React from "react";
import { NavLink } from "react-router-dom";

class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  render() {
    const { isOpen } = this.state;

    return (
      <>
        {" "}
        <div
          className={isOpen ? "overlay active" : "overlay"}
          onClick={this.handleClick}
        ></div>
        <div
          className={isOpen ? "dropdown active" : "dropdown"}
          onClick={this.handleClick}
        >
          <div className="dropdown__text flex-row justifyBetween no-wrap">
            <div className="flex-row no-wrap fullwidth">
              <img
                src="/assets/SearchIcon.svg"
                alt="search icon"
                style={{ height: "19px" }}
                className={isOpen ? "invisible" : "visible"}
              ></img>
              <p>
                {isOpen
                  ? " Which skill are you looking for?"
                  : "Looking for a designer?"}
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 33"
              className={isOpen ? "visible" : "invisible"}
            >
              <g
                id="Group_137"
                data-name="Group 137"
                transform="translate(-838.988 -94)"
              >
                <path
                  id="Icon_ionic-md-close"
                  data-name="Icon ionic-md-close"
                  d="M28.477,9.619l-2.1-2.1L18,15.9,9.619,7.523l-2.1,2.1L15.9,18,7.523,26.381l2.1,2.1L18,20.1l8.381,8.381,2.1-2.1L20.1,18Z"
                  transform="translate(832.172 93.5)"
                  stroke="#000"
                  strokeWidth="1"
                />
              </g>
            </svg>
          </div>
          {this.itemList(this.props.categories)}
        </div>
      </>
    );
  }

  handleClick = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  itemList = (props) => {
    const list = props.map((item, index) => (
      <div className="dropdown__item flex-row" key={index}>
        <img
          src="/assets/SearchIcon.svg"
          alt="search icon"
          style={{ height: "19px" }}
        ></img>
        <NavLink
          to={`../category/${item.slug.current}`}
          key={item.slug.current.toString()}
          // href={`../category/${item.slug.current}`}
        >
          {item.title}
        </NavLink>
      </div>
    ));
    return <div className="dropdown__items"> {list} </div>;
  };
}

export default Dropdown;
