import { useState } from "react";
import { createContainer } from "unstated-next";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useNews() {
  const [currentTag, setCurrentTag] = useState("");
  const [isVerticalScroll, setIsVerticalScroll] = useState(false);

  return {
    currentTag,
    setCurrentTag,
    isVerticalScroll,
    setIsVerticalScroll,
  };
}

const NewsContainer = createContainer(useNews);
export default NewsContainer;
