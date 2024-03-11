import { useState } from "react";

export const TextComponent = ({ text }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [startOffIndexVal, setStartOffIndexVal] = useState(null);
  const [endOffIndexVal, setEndOffIndexVal] = useState(null);
  const [highLightedTextVal, setHighLightedTextVal] = useState("");

  const checkHighlightExist = (payload) => {
    let isExisted = false;
    let responseObj = {};

    let { startOffSet, endOffSet } = payload;
    let matchedHighlightedObj;

    for (let index = 0; index < highlights.length; index++) {
      const element = highlights[index];
      if (
        startOffSet <= element?.startOffset &&
        element?.endOffset <= endOffSet
      ) {
        isExisted = true;
        matchedHighlightedObj = element;
        responseObj = { isExisted, matchedHighlightedObj };
        console.log(
          startOffSet,
          endOffSet,
          "highlightCheckArray=========1=========>",
          element?.startOffset,
          element?.endOffset
        );
        break;
      } else if (
        startOffSet <= element?.startOffset &&
        endOffSet <= element?.endOffset &&
        endOffSet >= element?.startOffset
      ) {
        isExisted = true;
        matchedHighlightedObj = element;
        responseObj = { isExisted, matchedHighlightedObj };
        console.log(
          startOffSet,
          endOffSet,
          "highlightCheckArray=========2=========>",
          element?.startOffset,
          element?.endOffset
        );

        break;
      }
    }

    return responseObj;
  };

  // Helper function to calculate absolute offset within the page
  const getAbsoluteOffset = (node, offset) => {
    let absoluteOffset = offset;

    // Check if parent node is a span
    if (node.parentNode.nodeName === "SPAN") {
      // Take a parent node
      let currentNode = node.parentNode;
      // Calculate offset based on the parent node's previous siblings
      while (currentNode.previousSibling) {
        absoluteOffset += currentNode.previousSibling.textContent.length;
        currentNode = currentNode.previousSibling;
      }
    }

    if (node.nodeType === Node.TEXT_NODE) {
      let currentNode = node;
      while (currentNode.previousSibling) {
        absoluteOffset += currentNode.previousSibling.textContent.length;
        currentNode = currentNode.previousSibling;
      }
    }

    return absoluteOffset;
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    if (!selection.toString() || range.startOffset == range.endOffset) {
      setShowPopup(false);
      return;
    }
    console.log("range-------------->", range);

    const absoluteStartOffset = getAbsoluteOffset(
      range.startContainer,
      range.startOffset
    );
    const absoluteEndOffset = getAbsoluteOffset(
      range.endContainer,
      range.endOffset
    );
    console.log(
      absoluteStartOffset,
      "absoluteEndOffset-------------->",
      absoluteEndOffset
    );

    setShowPopup(true);

    // checkIfHighlightExist or not
    let ifHighlighted = checkHighlightExist({
      startOffSet: absoluteStartOffset,
      endOffSet: absoluteEndOffset,
    });

    // TODO: If it's highlighted, then decide if we want to rearrange existing highlight offsets or not.
    if (ifHighlighted) {
      console.log(
        ifHighlighted,
        "popup-------------->",
        absoluteStartOffset,
        absoluteEndOffset
      );
    }

    setStartOffIndexVal(absoluteStartOffset);
    setEndOffIndexVal(absoluteEndOffset);
    setHighLightedTextVal(selection.toString());
  };

  const saveHighlightText = () => {
    let highlight = {
      endOffset: endOffIndexVal,
      highlightedColor: "orange",
      highlightedText: highLightedTextVal,
      startOffset: startOffIndexVal,
      text: "",
    };

    let pushHighlightArr = [...highlights];
    pushHighlightArr.push(highlight);
    pushHighlightArr = pushHighlightArr.sort(
      (a, b) => parseInt(a.startOffset) - parseInt(b.startOffset)
    );
    setHighlights(pushHighlightArr);
  };

  const renderParagraph = (text) => {
    let html = "";
    let currentIndex = 0;

    if (highlights?.length <= 0) {
      // TODO: uncommenting following will f##k up the actual highlights because we add br but those are not part of the original text.
      // text = text.replace(/\n/g, "<br/>");
      return { __html: text };
    }

    for (let i = 0; i < highlights.length; i++) {
      const highlight = highlights[i];
      let { startOffset, endOffset } = highlight;

      // Add the text before the highlighted portion
      html += `${text.substring(currentIndex, startOffset)}`;

      // Add the highlighted portion with styling
      html += `<span style="background-color: ${
        highlight.highlightedColor
      } ">${text.substring(startOffset, endOffset)}</span>`;
      currentIndex = endOffset;
    }

    // text = text.replace(/\n/g, "<br/>");
    html += `${text.substring(currentIndex)}`;
    return { __html: html };
  };

  return (
    <div>
      <p
        id="text"
        dangerouslySetInnerHTML={renderParagraph(text)}
        onMouseUp={handleHighlight}
      />
      {showPopup && (
        <div
          id="popup"
          className="absolute top-10 left-10 bg-white rounded-lg grid grid-cols-2 shadow-xl border"
        >
          <button className="p-3 border-r" onClick={saveHighlightText}>
            Highlight
          </button>
          <button className="p-3" onClick={() => setShowPopup(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
