import { useEffect, useState } from "react";

const fixedText = "I am fixed :)";
const whenNotFixed = "I am not a fixed header :(";

function handleStickyness(node, setText) {
  node.classList.add("sticky");
  document.title = fixedText;
  setText(fixedText);
}

function handleNormalBehaviour(node, setText) {
  node.classList.remove("sticky");
  document.title = whenNotFixed;
  setText(whenNotFixed);
}

function clearEventHandler(scrollCallBack) {
  window.removeEventListener("scroll", scrollCallBack);
}

export default function useScrollPosition(node) {
  const [text, setText] = useState(fixedText);
  useEffect(() => {
    console.log("loads scroll listening", node.current, node);
    if (node) {
      console.log("has node");
      const originalPosition = node.offsetTop;
      console.log(originalPosition);
      const scrollCallBack = window.addEventListener("scroll", () => {
        const sticky = node.offsetTop;
        if (window.pageYOffset > sticky) {
          handleStickyness(node, setText);
        }
        if (window.pageYOffset <= originalPosition) {
          handleNormalBehaviour(node, setText);
        }
      });
      return clearEventHandler(scrollCallBack);
    }
  }, []);
  return text;
}
