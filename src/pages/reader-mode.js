import React, { useEffect, useState } from "react";
// import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Button,
  Fade,
  Grid,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Slider from "@mui/material/Slider";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";
import { useCookies } from "react-cookie";
import Logo from "../../../assets/header/logo.png";
import backBtnIcon from "../../../assets/readermode/back_btn.svg";
import backBtnDarkModeIcon from "../../../assets/readermode/back_btn_dark.svg";
import fontSizeIcon from "../../../assets/readermode/font_size.svg";
import LightIcon from "../../../assets/readermode/light.png";
import thenModeSizeIcon from "../../../assets/readermode/thememode.svg";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { styled, useTheme } from "@mui/material/styles";

import MuiAppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";

import { API_URL } from "@/constants/apiURLs";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";
import cookie from "cookie";

import { STATUS } from "@/constants/status";
import Backdrop from "@mui/material/Backdrop";
import InputBase from "@mui/material/InputBase";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const drawerWidth = 395;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  //   ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiCollapse-vertical": {
    "& .MuiAccordionDetails-root": {
      "& .MuiTypography-root": {
        color: "#000000",
        fontSize: "16px",
        lineHeight: "26px",
        // fontWeight: '400',
      },
    },
  },
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<KeyboardArrowDownIcon sx={{ fontSize: "1.5rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  borderBottom: `1px solid #D9D9D9`,
  // backgroundColor: 'rgb(139 18 23 / 9%)',
  transition: "all 0.5s ease",
  borderRadius: "8px 8px 0 0",
  "& .MuiAccordionSummary-expandIconWrapper": {
    transform: "rotate(0deg)",
    "& svg": {
      fill: "#000000",
      transform: "scale(1.5)",
    },
    "&.Mui-expanded": {
      transform: "rotate(-180deg)",
      "& svg": {
        fill: "#000000",
      },
    },
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(0),
    "& .MuiTypography-root": {
      margin: 0,
    },
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const theme = createTheme({
  slider: {
    trackColor: "yellow",
    selectionColor: "red",
  },
});

function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 6,
    position: "relative",
    backgroundColor: "#f5f5f5",
    border: "2px solid transparent",
    fontSize: 16,
    width: "100%",
    padding: "10px 12px",
    boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.01)",
    transition: theme.transitions.create([
      "border",
      "background-color",
      "box-shadow",
    ]),
    "&:focus": {
      boxShadow: "none",
      border: "2px solid #8B1217",
    },
  },
}));

const ReaderMode = ({
  booksData,
  slug,
  locale,
  keyTakeAwayList,
  readerModeSetting,
  userData,
  keyTakeAwayNumbers,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(true);
  const [currentTheme, setCurrentTheme] = React.useState(0);
  const [sliderValue, setSliderValue] = React.useState(
    readerModeSetting?.fontSize ? readerModeSetting?.fontSize : 16
  );
  const [expanded, setExpanded] = React.useState("panel1");
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [selectedKeyTakeAway, setSelectedTakeAway] = React.useState(0);
  const [themeMode, setThemeMode] = React.useState(
    readerModeSetting?.themeMode ? readerModeSetting?.themeMode : 1
  );
  const [hideTitle, setHideTitle] = React.useState(false);
  const [userTypeGuest, setUserTypeGuest] = React.useState(
    userData ? true : false
  );
  const [currentBookId, setCurrentBookId] = React.useState(booksData.idbook);
  const [currentContentType, setCurrentContentType] = React.useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // highlightText
  const [highlights, setHighlights] = React.useState([]);

  const [allHighLightArr, setAllHighLightArr] = React.useState([]);

  const [summaryHighlightArr, setSummaryHighlightArr] = React.useState([]);
  const [benefitHighlightArr, setBenefitsHighlightArr] = React.useState([]);
  const [takeAwayHighlightArr, setTakeAwayHighlightArr] = React.useState([]);

  const [summaryNotedList, setSummaryNotedList] = React.useState([]);
  const [benefitNotedList, setBenefitsNotedList] = React.useState([]);
  const [takeAwayNotedList, setTakeAwayNotedList] = React.useState([]);

  const [bookHighlightStack, setBookHighlightStack] = React.useState([]);

  const popupTagRef = React.useRef(null);
  const textareaRef = React.useRef(null);
  const [isPopupVisible, setPopupVisible] = React.useState(false);
  const [selectedText, setSelectedText] = React.useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [message, setMessage] = useState("");
  const [noteValue, setNoteValue] = useState("");

  const [currentBenefitIndex, setCurrentBenefitIndex] = useState(null);
  const [startOffIndexVal, setStartOffIndexVal] = useState(null);
  const [endOffIndexVal, setEndOffIndexVal] = useState(null);
  const [highLightedTextVal, setHighLightedTextVal] = useState("");

  // start ::Note modal popup
  const [openNote, setOpenNote] = React.useState(false);
  const handleAddCollectionOpen = () => {
    setOpenNote(true);
    setPopupVisible(true);
  };
  const handleAddCollectionClose = () => {
    setOpenNote(false);
    setPopupVisible(false);
    console.log("laidu dada------------------>");
    // setMessage(" ");
  };

  // END ::Note modal popup

  //manage indexing benefits text and keyTakeaways

  /**
   * benefit_index : 0
   * content_type : 1
   * highlightedText : "ourselves"
   * isNoted : false
   * key_takeaway_index : 0
   * startOffset :
   * endOffset :
   * text
   */

  /**
   * Content Type
   * 1 : Summary
   * 2 : Benefits
   * 3 : Key Takeaways
   * @param {} param0
   */

  const setHighLightText = async ({ bookId, bookHighlight, version }) => {
    try {
      let payload = {
        bookId,
        bookHighlight,
        version,
      };

      // console.log("get User Response for this book--------->",bookId, bookHighlight, version);

      //   const response = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}${API_URL.saveReaderModeSetting}`,
      //   {
      //     method: "POST",
      //     headers: {
      //         Authorization: `Bearer ${cookies.token}`,
      //         "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(payload)
      //   }
      //   );
      // const resData = (await response.json());
      // console.log("get User Response for this book--------->",resData);
    } catch (error) {
      console.log("error--------->", error);
    }
  };

  const getHighLightText = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}${API_URL.getHighLightText}?bookId=${currentBookId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const resData = await response.json();

      let userHighlightData = resData.data;
      if (userHighlightData?.bookHighlight?.length) {
        let summaryArr = [],
          takeawayArr = [],
          benefitsArr = [];
        let summaryNoteArr = [],
          takeawayNoteArr = [],
          benefitsNoteArr = [];

        for (
          let index = 0;
          index < userHighlightData?.bookHighlight.length;
          index++
        ) {
          const element = userHighlightData?.bookHighlight[index];
          if (element.content_type == 1) {
            if (element?.isNoted) {
              summaryNoteArr.push(element);
            } else {
              summaryArr.push(element);
            }
          } else if (element.content_type == 2) {
            if (element?.isNoted) {
              benefitsNoteArr.push(element);
            } else {
              benefitsArr.push(element);
            }
          } else if (element.content_type == 3) {
            if (element?.isNoted) {
              takeawayNoteArr.push(element);
            } else {
              takeawayArr.push(element);
            }
          }
        }

        // note list
        setSummaryNotedList(summaryNoteArr);
        setBenefitsNotedList(benefitsNoteArr);
        setTakeAwayNotedList(takeawayNoteArr);
        //note list end

        setBookHighlightStack(userHighlightData?.bookHighlight);
        setSummaryHighlightArr(summaryArr);
        setBenefitsHighlightArr(benefitsArr);
        setTakeAwayHighlightArr(takeawayArr);
      }
    } catch (error) {
      console.log("error--------->", error);
    }
  };

  const saveHighlightText = (color) => {
    let setHighlightObj = {
      benefit_index: 0,
      content_type: currentContentType,
      endOffset: endOffIndexVal,
      highlightedColor: color,
      highlightedText: highLightedTextVal,
      isNoted: false,
      key_takeaway_index: 0,
      startOffset: startOffIndexVal,
      text: "",
    };

    if (currentContentType === 1) {
      let pushHighlightArr = [...summaryHighlightArr];
      pushHighlightArr.push(setHighlightObj);
      pushHighlightArr = pushHighlightArr.sort(
        (a, b) => parseInt(a.startOffset) - parseInt(b.startOffset)
      );
      setSummaryHighlightArr(pushHighlightArr);
    }

    if (
      currentContentType === 2 &&
      keyTakeAwayList[selectedKeyTakeAway]?.isBenefitAvail
    ) {
      setHighlightObj.benefit_index = currentBenefitIndex - 1;
      if (benefitHighlightArr?.length) {
        let pushHighlightArr = [...benefitHighlightArr];
        pushHighlightArr.push(setHighlightObj);
        pushHighlightArr = pushHighlightArr.sort(
          (a, b) => parseInt(a.startOffset) - parseInt(b.startOffset)
        );
        setBenefitsHighlightArr(pushHighlightArr);
      } else {
        setBenefitsHighlightArr([setHighlightObj]);
      }
    }

    if (currentContentType === 3) {
      setHighlightObj.key_takeaway_index =
        keyTakeAwayList[selectedKeyTakeAway]?.number - 1;
      if (takeAwayHighlightArr?.length) {
        let pushHighlightArr = [...takeAwayHighlightArr];
        pushHighlightArr.push(setHighlightObj);
        pushHighlightArr = pushHighlightArr.sort(
          (a, b) => parseInt(a.startOffset) - parseInt(b.startOffset)
        );
        setTakeAwayHighlightArr(pushHighlightArr);
      } else {
        setTakeAwayHighlightArr(setHighlightObj);
      }
    }

    setPopupVisible(false);
    setHighlights([
      ...highlights,
      {
        text: highLightedTextVal,
        startOffset: startOffIndexVal,
        endOffset: endOffIndexVal,
      },
    ]);
  };

  const checkHighlightExist = (payload) => {
    let isExisted = false;
    let responseObj = {};

    let { startOffSet, endOffSet, benefit_index } = payload;
    let highlightCheckArray = [];
    let matchedHighlightedObj;
    if (currentContentType == 1) {
      highlightCheckArray = summaryHighlightArr;
      for (let index = 0; index < summaryHighlightArr.length; index++) {
        const element = summaryHighlightArr[index];
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
        // else if(element?.startOffset >= endOffSet  && endOffSet <= element?.endOffset ){
        //   isExisted = true;
        //   matchedHighlightedObj = element
        //   responseObj = {isExisted, matchedHighlightedObj }
        //   console.log("highlightCheckArray=======3===========>",responseObj);

        //   break;
        // }
        // else if(startOffSet >= element?.startOffset &&  element?.endOffset <= endOffSet  ){
        //   isExisted = true;
        //   matchedHighlightedObj = element
        //   responseObj = {isExisted, matchedHighlightedObj }
        //   console.log("highlightCheckArray==========4========>",responseObj);

        //   break;
        // }
      }
    }
    if (currentContentType == 2) {
      highlightCheckArray = benefitHighlightArr;
    }
    if (currentContentType == 3) {
      highlightCheckArray = takeAwayHighlightArr;
    }

    return responseObj;
  };

  const handleHighlight = (benefit_number) => {
    if (typeof window !== "undefined") {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      if (!selection.toString() || range.startOffset == range.endOffset) {
        setPopupVisible(false);
        setOpenNote(false);
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

      setPopupVisible(true);

      // checkIfHighlightExist or not
      let ifHighlighted = checkHighlightExist({
        startOffSet: absoluteStartOffset,
        endOffSet: absoluteEndOffset,
        benefit_index: benefit_number,
      });

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
      setCurrentBenefitIndex(benefit_number);
      //const highlightedText = selection.toString();

      const rect = range.getBoundingClientRect();
      const tooltipTop = rect.top - 65; // Adjust the value as needed
      const tooltipLeft = rect.left + rect.width / 2;

      setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
    }
  };
  // Helper function to calculate absolute offset within the page
  const getAbsoluteOffset = (node, offset) => {
    let absoluteOffset = offset;

    if (node.nodeType === Node.TEXT_NODE) {
      let currentNode = node;
      while (currentNode.previousSibling) {
        absoluteOffset += currentNode.previousSibling.textContent.length;
        currentNode = currentNode.previousSibling;
      }
    }
    return absoluteOffset;
  };

  useEffect(() => {
    getHighLightText();
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      // Check if the click is outside the tooltip and text selection
      if (
        !event.target.closest(".tooltip-container") &&
        event.target.closest(".tooltip-container") !== null &&
        window.getSelection().isCollapsed &&
        !openNote
      ) {
        setPopupVisible(false);
      }
    };

    // Attach the event listener to the document
    document.addEventListener("click", handleDocumentClick);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const setCurrentSelectIndex = (index) => {
    setSelectedTakeAway(index);
  };

  const handleSliderChange = async (event, newValue) => {
    return setSliderValue(newValue);
  };
  const saveUserSliderValue = (event, newValue) => {
    return updateUserReaderModeSetting({ fontSize: newValue });
  };

  const handleThemeModeSetting = async (newValue) => {
    setThemeMode(newValue);
    return updateUserReaderModeSetting({ themeMode: newValue });
  };
  const updateUserReaderModeSetting = async (payload) => {
    // "themeMode":1,
    // "fontSize":18
    if (!userTypeGuest) {
      return;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}${API_URL.saveReaderModeSetting}/${userData?.data?.uid}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const resData = await response.json();
    // if (resData.success) {
    //     setBookExistInFav(true)
    //     toast(t(`Message-Type.COLLECTION.BOOK_ADDED`), { autoClose: 3000, position: "top-left", hideProgressBar: true, type: "success" });
    // }
  };

  useEffect(() => {
    setCurrentSelectIndex(0);
    setSliderValue(readerModeSetting?.fontSize);
    setUserTypeGuest(userData ? true : false);
  }, [slug]);

  const updateDimensions = () => {
    if (open && window.innerWidth < 768) {
      setOpen(false);
      if (open && window.innerWidth <= 480) {
        setHideTitle(true);
      }
    } else {
      setOpen(true);
      setHideTitle(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  function decimalToHex(decimalColor) {
    // Convert decimal color to hexadecimal
    const hexColor = decimalColor.toString(16);

    // Pad with zeros to ensure it's always 8 characters long (RGBA)
    const paddedHexColor = ("00000000" + hexColor).slice(-8);
    return `#${paddedHexColor}`;
  }

  const renderParagraph = (text, benefit_index) => {
    let html = "";
    let currentIndex = 0;
    let highlightArr = [];
    if (currentContentType === 1) {
      highlightArr = summaryHighlightArr;
    } else if (currentContentType === 2) {
      highlightArr = benefitHighlightArr;
      let isBenefitHighlight = false;
      highlightArr.forEach((element) => {
        if (element.benefit_index == benefit_index - 1) {
          isBenefitHighlight = true;
        }
      });
      // if(!isBenefitHighlight){
      //   return { __html :text}
      // }
    } else if (currentContentType === 3) {
      highlightArr = takeAwayHighlightArr.filter(
        (element) => element.key_takeaway_index == benefit_index - 1
      );
    }
    if (highlightArr?.length <= 0) {
      text.replace("\n", "<br>");
      return { __html: text };
    }

    for (let i = 0; i < highlightArr.length; i++) {
      const highlight = highlightArr[i];
      let { startOffset, endOffset } = highlight;

      let hexadecimalColorValue = decimalToHex(highlight.highlightedColor);
      if (
        currentContentType === 2 &&
        benefit_index - 1 !== highlight.benefit_index
      ) {
        continue;
      }

      if (currentContentType === 3) {
        endOffset += 1;
        if (benefit_index - 1 !== highlight?.key_takeaway_index) {
          console.log(
            "highlight.key_takeaway_index------------>",
            benefit_index - 1,
            highlight.key_takeaway_index
          );
          continue;
        }
      }

      // Add the text before the highlighted portion
      html += `${text.substring(currentIndex, startOffset)}`;

      // Add the highlighted portion with styling
      html += `<span style="background-color: ${hexadecimalColorValue} ">${text.substring(
        startOffset,
        endOffset
      )}</span>`;
      currentIndex = endOffset;
    }

    text.replace("\n", "<BR>");
    html += `${text.substring(currentIndex)}`;
    return { __html: html };
  };

  useEffect(() => {
    setCurrentContentType(keyTakeAwayList[selectedKeyTakeAway]?.content_type);
  }, [selectedKeyTakeAway]);

  /** (1,5),(7,11),(13,17)
   * (0,15)
   */

  /** Handle condition
   *
   * update start range (0,3)
   * update end range (3,6)
   * update start end removed in between node (0,15)
   * merge connected and update start end (4,9)
   * add new node in list (18,23)
   *
   */

  const handleHighlightFunction = ({
    content_type,
    startOffSet,
    endOffset,
    highlightedText,
  }) => {
    let list = [],
      stack = [];
    let offset = { startOffSet, endOffset };
    if (content_type == 1) {
      stack = summaryHighlightArr;
    } else if (content_type == 2) {
      stack = benefitHighlightArr;
    } else if (content_type == 3) {
      stack = takeAwayHighlightArr;
    }

    if (stack?.length <= 0) {
      stack.push();
    } else {
      for (let i = 0; i < stack.length; i++) {
        const element = stack[i];
        list.push(element);
      }

      list.splice();
      list.sort((a, b) => a.startOffset - b.startOffset);

      let addHighLight = {},
        isAdd = false;
      console.log("list--------*--------->", list);

      let removedIndexList = [];
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        let pointer = element;

        for (let j = i; j < list.length; j++) {
          const jElement = list[j];
        }
      }

      if (removedIndexList?.length > 0) {
        removedIndexList.forEach((val) => {
          console.log("removedIndexList--------**--------->", val);
          list.splice(val, 1);
        });
      }
      console.log("list--------***--------->", list);

      if (isAdd) {
        list.push({
          startOffSet: startOffSet,
          endOffset: endOffset,
          highlightedText: highlightedText,
        });
      }
    }
    return list;
  };

  const getSelected = () => {
    const selection = window.getSelection();
    if (selection) {
      return selection.toString();
    }
    return false;
  };

  function splitTextOffsets(
    totalStringOffset,
    highlightOffsets,
    newHighlightOffsets
  ) {
    let plaintext = [];
    let hightlighttext = [];

    // Merge the highlightOffsets and newHighlightOffsets arrays
    let finalHighlightOffsets = highlightOffsets.concat(newHighlightOffsets);

    // Sort the finalHighlightOffsets array based on the start index
    finalHighlightOffsets.sort((a, b) => a[0] - b[0]);

    // Step 1: Loop through the totalStringOffset range
    for (let i = totalStringOffset[0]; i <= totalStringOffset[1]; i++) {
      let isInHighlight = false;
      for (let offset of finalHighlightOffsets) {
        if (i >= offset[0] && i <= offset[1]) {
          isInHighlight = true;
          break;
        }
      }

      // Step 3: Split the range based on the conditions
      if (isInHighlight) {
        if (
          hightlighttext.length === 0 ||
          hightlighttext[hightlighttext.length - 1][1] !== i - 1
        ) {
          // If the current number is not part of the existing highlight range, start a new one
          hightlighttext.push([i, i]);
        } else {
          // If the current number is part of the existing highlight range, extend the range
          hightlighttext[hightlighttext.length - 1][1] = i;
        }
      } else {
        plaintext.push([i, i]);
      }
    }

    // Combine consecutive numbers in the ranges
    function combineConsecutiveRanges(ranges) {
      let result = [];
      let currentRange = null;

      for (let range of ranges) {
        if (!currentRange || range[0] > currentRange[1] + 1) {
          if (currentRange) {
            result.push(currentRange);
          }
          currentRange = [range[0], range[1]];
        } else {
          currentRange[1] = range[1];
        }
      }

      if (currentRange) {
        result.push(currentRange);
      }
      return result;
    }

    // Combine consecutive ranges in each category
    plaintext = combineConsecutiveRanges(plaintext);
    hightlighttext = combineConsecutiveRanges(hightlighttext);

    return { plaintext: plaintext, hightlighttext: hightlighttext };
  }

  // let totalStringOffset = [0, 400];
  // let highlightOffsets = [[50, 150], [180, 250]];
  // let newHighlightOffsets = [[100, 179], [230, 260]];

  // let result = splitTextOffsets(totalStringOffset, highlightOffsets, newHighlightOffsets);

  // console.log('Plaintext:', result['plaintext']);
  // console.log('Highlight Text:', result['hightlighttext']);

  //   const onSubmit = async () => {

  //     console.log('On Note : payload data ',payload);

  //     // const response = await fetch(process.env.NEXT_PUBLIC_BE_URL + API_URL.addCollectionAndBook, {
  //     //     method: "POST",
  //     //     headers: {
  //     //         Authorization: `Bearer ${cookies.token}`,
  //     //         "Content-Type": "application/json",
  //     //     },
  //     //     body: JSON.stringify(payload)
  //     // }
  //     // );
  //     // const resData = (await response.json());
  //     // if (resData.success) {
  //     //     addBookInFav(resData.data.bid)
  //     //     setBookExistInFav(true)
  //     //     getCollection()
  //     // }
  // };

  const handleNoteSave = async (data) => {
    console.log(
      "on submit-------------->",
      startOffIndexVal,
      endOffIndexVal,
      highLightedTextVal
    );
    toast(`selected note highlight !`, {
      autoClose: 3000,
      position: "top-left",
      hideProgressBar: true,
      type: "error",
    });
  };

  const handleTextChange = (event) => {
    console.log("event-------------", event.target);
    // setMessage(event.target.value);
    setNoteValue(event.target.value);
  };

  return (
    <Box
      sx={{ display: "flex" }}
      className={`reader-mode-wrapper ${
        themeMode === 1 ? "Light-Mode" : "Dark-Mode"
      }`}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ bgcolor: "transparent", boxShadow: "unset" }}
      >
        <Toolbar>
          <IconButton
            className="toggle-btn"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
          >
            {open ? (
              <ChevronLeftIcon className="left-icon" />
            ) : (
              <ChevronRightIcon className="right-icon" />
            )}
          </IconButton>
          {hideTitle && open ? (
            <> </>
          ) : (
            <>
              <Box className="reader-title">
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ color: "#000000", paddingLeft: "16px" }}
                >
                  Reader Mode
                </Typography>
                <Link href={`/books/${slug}`} locale={locale ? locale : "en"}>
                  {" "}
                  <Image
                    src={themeMode == 1 ? backBtnIcon : backBtnDarkModeIcon}
                    width={30}
                    height={30}
                    alt="Back"
                    priority="true"
                    className="back-btn"
                    onClick={() => {
                      updateUserReaderModeSetting({
                        fontSize: sliderValue,
                        themeMode: themeMode,
                      });
                    }}
                  />
                </Link>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        className="book-sidebar"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box className="book-leftsidebar">
          <Link href="/" className="book-logo">
            <Image
              src={Logo}
              width={163}
              height={60}
              alt="Header Logo"
              priority="true"
            />
          </Link>
          <Box className="side-content-wrapper">
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
              className="expand-detail-drawer"
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Image
                  src={LightIcon}
                  width={30}
                  height={30}
                  alt="Header Logo"
                  priority="true"
                />
                <Typography className="accor-title">
                  {t("ReaderMode.explore-book")} ({keyTakeAwayNumbers})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="book-accordion-details">
                  {keyTakeAwayList?.map((element, index) => (
                    <>
                      <Box sx={{ display: "flex", marginBottom: "5px" }}>
                        <Typography
                          className="ellipsis-3"
                          sx={{ fontSize: "29px", fontWeight: "bold" }}
                          onClick={() => setCurrentSelectIndex(2)}
                        >
                          {" "}
                          {index == 2 ? "Key Takeaways" : ""}
                        </Typography>
                        <Typography sx={{ minWidth: "30px" }}> </Typography>
                      </Box>

                      {index < 2 ? (
                        <Box sx={{ display: "flex", marginBottom: "16px" }}>
                          <Typography
                            className="ellipsis-3"
                            sx={{ fontSize: "29px", fontWeight: "bold" }}
                            onClick={() => setCurrentSelectIndex(index)}
                          >
                            {" "}
                            {element?.drawerTitle}
                          </Typography>
                          <Typography sx={{ minWidth: "30px" }}> </Typography>
                        </Box>
                      ) : (
                        <>
                          <Box sx={{ display: "flex", marginBottom: "16px" }}>
                            <Typography sx={{ minWidth: "30px" }}> </Typography>
                            <Typography sx={{ minWidth: "30px" }}>
                              {element?.number ? element?.number + "." : ""}
                            </Typography>
                            <Typography
                              onClick={() => setCurrentSelectIndex(index)}
                              className="ellipsis-3"
                            >
                              {" "}
                              {element?.drawerTitle}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
            <Box>
              <Box
                className="book-details-font"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Image
                  src={fontSizeIcon}
                  width={30}
                  height={30}
                  alt="Header Logo"
                  priority="true"
                />
                <Typography sx={{ marginLeft: "10px", marginBottom: "16px" }}>
                  Font Size
                </Typography>
              </Box>
              <ThemeProvider theme={theme}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                  className="book-slider-wrap"
                >
                  <Typography
                    variant="h5"
                    component="h5"
                    className="book-font-small"
                  >
                    A
                  </Typography>
                  <Slider
                    className="slider-value"
                    defaultValue={sliderValue}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    min={12}
                    max={50}
                    onChange={handleSliderChange}
                    onChangeCommitted={saveUserSliderValue}
                    sx={{
                      width: 330,
                      color: "#8B1218",
                    }}
                  />
                  <Typography
                    variant="h5"
                    component="h5"
                    className="book-font-large"
                  >
                    A
                  </Typography>
                </Box>
              </ThemeProvider>
            </Box>
            <Box>
              <Box
                className="book-details-font"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Image
                  src={thenModeSizeIcon}
                  width={30}
                  height={30}
                  alt="Header Logo"
                  priority="true"
                />
                <Typography sx={{ marginLeft: "10px", marginBottom: "12px" }}>
                  Theme Mode
                </Typography>
              </Box>
              <Box className="book-theme-radio">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={themeMode == 1 ? "Light-Mode" : "Dark-Mode"}
                    name="radio-buttons-group"
                    row
                    className="radio-button-group"
                  >
                    <FormControlLabel
                      value="Light-Mode"
                      onChange={() => {
                        handleThemeModeSetting(1);
                      }}
                      control={<Radio />}
                      label="Light Mode"
                    />
                    <FormControlLabel
                      value="Dark-Mode"
                      onChange={() => {
                        handleThemeModeSetting(2);
                      }}
                      control={<Radio />}
                      label="Dark Mode"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
      <Main open={open} className="height-wrapper">
        <DrawerHeader />
        <Grid item xs={12} sm={12} md={8} lg={9} xl={8.5}>
          <Box className="book-reader-details">
            <Typography variant="h4" component="h4" className="book-h4">
              {booksData.title}
            </Typography>
            <Typography variant="h6" component="h6" className="book-h6">
              {keyTakeAwayList[selectedKeyTakeAway]?.title}
            </Typography>
            <Typography variant="h5" component="h5" className="book-h5">
              {keyTakeAwayList[selectedKeyTakeAway]?.subtitle}
            </Typography>
            <Box>
              {isPopupVisible ? (
                <Box
                  style={{
                    position: "absolute",
                    top: `${tooltipPosition.top}px`,
                    left: `${tooltipPosition.left}px`,
                    background: "#fff",
                    padding: "10px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Button
                    className="next-pre-btn"
                    onClick={() => {
                      saveHighlightText("2569115379");
                    }}
                  >
                    color 1
                  </Button>
                  <Button
                    className="next-pre-btn"
                    onClick={() => {
                      saveHighlightText("2576028183");
                    }}
                  >
                    color 2
                  </Button>
                  <Button
                    className="next-pre-btn"
                    onClick={() => {
                      saveHighlightText("2566952584");
                    }}
                  >
                    color 3
                  </Button>
                  <Button
                    className="next-pre-btn"
                    onClick={() => {
                      saveHighlightText("2582922038");
                    }}
                  >
                    color 4
                  </Button>
                  <Button
                    className="next-pre-btn"
                    onClick={handleAddCollectionOpen}
                  >
                    Note
                  </Button>

                  {/* START :: ADD NEW Note MODAL */}
                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openNote}
                    onClose={handleAddCollectionClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                      backdrop: {
                        timeout: 500,
                      },
                    }}
                  >
                    <Fade in={openNote}>
                      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
                      <Box
                        className="modal-wrapper"
                        sx={{ maxWidth: "400px", width: "100%" }}
                      >
                        <Box className="modal-text-content">
                          <Typography
                            id="transition-modal-title"
                            variant="h6"
                            component="h2"
                          >
                            {/* {t("Collection.add")} */}
                            NOTE
                          </Typography>
                          <TextField
                            id="standard-multiline-static"
                            multiline
                            sx={{ width: "100%" }}
                            rows={4}
                            onKeyUp={(val) => {
                              handleTextChange(val);
                            }}
                            placeholder="Enter your note here..."
                            value={noteValue}
                            variant="standard"
                            {...register("Note", { required: true })}
                          />
                          {errors.Note && (
                            <Typography
                              className="error-message"
                              variant="body2"
                              component="span"
                            >
                              {" "}
                              {t("Collection.required")}
                            </Typography>
                          )}
                        </Box>
                        <Box className="modal-footer" sx={{ mt: 3 }}>
                          <Stack
                            direction="row"
                            spacing={2}
                            justifyContent={"end"}
                          >
                            <Button
                              variant="contained"
                              className="action-btn edit"
                              type="submit"
                              disabled={
                                message.trim().length == 0 ? true : false
                              }
                              onClick={() => {
                                handleAddCollectionClose(), handleNoteSave();
                              }}
                            >
                              {/* {t("Collection.create")} */}
                              SAVE
                            </Button>
                            <Button
                              variant="contained"
                              className="action-btn remove"
                              onClick={handleAddCollectionClose}
                            >
                              {" "}
                              {t("Collection.cancel")}
                            </Button>
                          </Stack>
                        </Box>
                      </Box>
                      {/* </form> */}
                    </Fade>
                  </Modal>
                  {/* END :: ADD NEW Note MODAL */}
                </Box>
              ) : (
                <></>
              )}
            </Box>
            {keyTakeAwayList[selectedKeyTakeAway]?.subtitle == "Summary" ? (
              <br />
            ) : (
              <></>
            )}
            {keyTakeAwayList[selectedKeyTakeAway]?.isBenefitAvail ? (
              keyTakeAwayList[selectedKeyTakeAway]?.text?.map(
                (element, index) => (
                  <Typography
                    key={index}
                    sx={{ fontSize: sliderValue }}
                    dangerouslySetInnerHTML={renderParagraph(
                      element?.text,
                      element?.number
                    )}
                    onMouseUp={() => {
                      handleHighlight(element?.number);
                    }}
                  ></Typography>
                )
              )
            ) : (
              <>
                <Typography
                  dangerouslySetInnerHTML={renderParagraph(
                    keyTakeAwayList[selectedKeyTakeAway]?.text,
                    keyTakeAwayList[selectedKeyTakeAway].number
                  )}
                  sx={{ fontSize: sliderValue }}
                  onMouseUp={handleHighlight}
                ></Typography>
                <Typography
                  dangerouslySetInnerHTML={{
                    __html:
                      keyTakeAwayList[selectedKeyTakeAway]?.plan_upgrade_text,
                  }}
                ></Typography>
              </>
            )}
          </Box>
          <Button
            className="next-pre-btn"
            onClick={() => setCurrentSelectIndex(selectedKeyTakeAway - 1)}
            sx={{ float: "left" }}
          >
            {keyTakeAwayList[selectedKeyTakeAway - 1]?.title
              ? `< ${keyTakeAwayList[selectedKeyTakeAway - 1]?.title}`
              : keyTakeAwayList[selectedKeyTakeAway - 1]?.drawerTitle
              ? `< ${keyTakeAwayList[selectedKeyTakeAway - 1]?.drawerTitle}`
              : ""}
          </Button>
          <Button
            className="next-pre-btn"
            onClick={() => setCurrentSelectIndex(selectedKeyTakeAway + 1)}
            sx={{ float: "right" }}
          >
            {keyTakeAwayList[selectedKeyTakeAway + 1]?.title
              ? `${keyTakeAwayList[selectedKeyTakeAway + 1]?.title} >`
              : keyTakeAwayList[selectedKeyTakeAway + 1]?.drawerTitle
              ? `${keyTakeAwayList[selectedKeyTakeAway + 1]?.drawerTitle} >`
              : ""}
          </Button>
        </Grid>
      </Main>
    </Box>
  );
};

export default ReaderMode;
export const getServerSideProps = async ({ req, params, locale }) => {
  const { details } = params;
  const cookies = parseCookies(req);
  let keyTakeAwayList = [],
    readerModeSetting = {},
    userData,
    premiumBookDetails,
    booksData,
    keyTakeAwayNumbers = 0;

  const bookResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BOOK_GOBBLE_JSON}${locale}/bookdetails/${details}.json`
  );
  const matchedBook = await bookResponse.json();

  if (cookies.token) {
    //get subscription details
    const statusResponse = await fetch(
      process.env.NEXT_PUBLIC_BE_URL + API_URL.getUserDetail,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    userData = await statusResponse.json();

    if (
      userData?.data?.status === STATUS.ACTIVE ||
      userData?.data?.status === STATUS.PAID ||
      userData?.data?.status === STATUS.TRAIL ||
      userData?.data?.status === STATUS.VIP_PREMIUM ||
      userData?.data?.status === STATUS.SUPER
    ) {
      const singlePremiumBookDetailRes = await fetch(
        `${
          process.env.NEXT_PUBLIC_BE_URL + API_URL.singlePremiumBookDetail
        }?bgurl=${encodeURIComponent(details)}&language=${locale}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const premiumBookData = await singlePremiumBookDetailRes.json();
      premiumBookDetails = premiumBookData?.data?.json
        ? premiumBookData?.data?.json
        : {};

      if (premiumBookDetails?.summary) {
        premiumBookDetails.summary = premiumBookDetails?.summary.replace(
          /<BR>/g,
          "\n"
        );
        keyTakeAwayList.push({
          drawerTitle: "Summary",
          subtitle: "Summary",
          text: premiumBookDetails?.summary,
          content_type: 1,
        });
      }
      if (premiumBookDetails?.benefits?.length) {
        // premiumBookDetails?.benefits?.map(c=>c.text = `<br/>` +c.text+`<br/>`)
        keyTakeAwayList.push({
          drawerTitle: "Benefits",
          subtitle: "Why read this book",
          text: premiumBookDetails?.benefits,
          isBenefitAvail: true,
          content_type: 2,
        });
      }
      if (premiumBookDetails?.key_points?.length) {
        premiumBookDetails?.key_points.forEach((element, index) => {
          //logic for removing <p> tag and replace with <br/>
          let stringWithoutPTags = element.expanded.replace(/<p>/g, "\n");
          // // Replace closing </p> tags with <br/>
          stringWithoutPTags = stringWithoutPTags.replace(/<\/p>/g, "");
          element.expanded = stringWithoutPTags;
          keyTakeAwayList.push({
            drawerTitle: element.text,
            number: element?.number,
            title: `Key Takeaway #${element?.number}`,
            subtitle: element.text,
            text: element.expanded,
            content_type: 3,
          });
        });
      }
      booksData = premiumBookDetails;
      keyTakeAwayNumbers = premiumBookDetails?.key_points?.length;
    } else if (userData?.data?.userType === "free") {
      if (matchedBook?.summary) {
        keyTakeAwayList.push({
          drawerTitle: "Summary",
          subtitle: "Summary",
          text: matchedBook?.summary,
          content_type: 1,
        });
      }
      if (matchedBook?.benefits?.length) {
        matchedBook?.benefits?.map(
          (c) => (c.text = `<br/>` + c.text + `<br/>`)
        );
        keyTakeAwayList.push({
          drawerTitle: "Benefits",
          subtitle: "Why read this book",
          text: matchedBook?.benefits,
          isBenefitAvail: true,
          content_type: 2,
        });
      }
      if (matchedBook?.key_points?.length) {
        matchedBook?.key_points.forEach((element, index) => {
          if (element?.number === 1) {
            keyTakeAwayList.push({
              drawerTitle: element.text,
              number: element?.number,
              title: `Key Takeaway #${element?.number}`,
              subtitle: element.text,
              text: element?.expanded,
              content_type: 3,
            });
          } else if (element?.mustlogin) {
            keyTakeAwayList.push({
              drawerTitle: element.text,
              number: element?.number,
              title: `Key Takeaway #${element?.number}`,
              subtitle: element.text,
              text: element?.expanded,
              content_type: 3,
            });
          } else {
            keyTakeAwayList.push({
              drawerTitle: element.text,
              number: element?.number,
              title: `Key Takeaway #${element?.number}`,
              subtitle: element.text,
              text: element?.expanded,
              content_type: 3,
              plan_upgrade_text: `<h3>Want to see the rest of this key takeaways?</h3><a href="/pricing"><p className="plan-upgrade">Upgrade to watch this Key Takeaway<p></a>`,
            });
          }
        });
      }
      booksData = matchedBook;
      keyTakeAwayNumbers = matchedBook?.key_points?.length;
    }
  } else {
    if (matchedBook?.summary) {
      keyTakeAwayList.push({
        drawerTitle: "Summary",
        subtitle: "Summary",
        text: matchedBook?.summary,
        content_type: 1,
      });
    }
    if (matchedBook?.benefits?.length) {
      // matchedBook?.benefits?.map(c=>c.text =`<br/>` + c.text+`<br/>`);
      keyTakeAwayList.push({
        drawerTitle: "Benefits",
        subtitle: "Why read this book",
        text: matchedBook?.benefits,
        isBenefitAvail: true,
        content_type: 2,
      });
    }
    if (matchedBook?.key_points?.length) {
      matchedBook?.key_points.forEach((element, index) => {
        if (element?.number === 1 && !element?.mustlogin) {
          keyTakeAwayList.push({
            drawerTitle: element.text,
            number: element?.number,
            title: `Key Takeaway #${element?.number}`,
            subtitle: element.text,
            text: element?.expanded,
            content_type: 3,
          });
        } else if (element?.mustlogin) {
          keyTakeAwayList.push({
            drawerTitle: element.text,
            number: element?.number,
            title: `Key Takeaway #${element?.number}`,
            subtitle: element.text,
            text: element?.expanded_preview,
            content_type: 3,
            plan_upgrade_text: `<h3>Want to see the rest of this key takeaways?</h3> <p>Free  <a href="/signup" > <b>Signup</b></a> to View This Key Takeaway, or  <a href="/login"><b> Login</b></a> if you have an account.</p> `,
          });
        } else {
          keyTakeAwayList.push({
            drawerTitle: element.text,
            number: element?.number,
            title: `Key Takeaway #${element?.number}`,
            subtitle: element.text,
            text: element?.expanded,
            content_type: 3,
            plan_upgrade_text: `<h3>Want to see the rest of this key takeaways?</h3> <p className="plan-upgrade"><a href="/pricing">Upgrade to watch this Key Takeaway</a><p>`,
          });
        }
      });
      keyTakeAwayNumbers = matchedBook?.key_points?.length;
    }
    booksData = matchedBook;
  }
  const userReaderModeSetting = await fetch(
    process.env.NEXT_PUBLIC_BE_URL + API_URL.getReaderModeSetting,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookies?.token}`,
        "Content-Type": "application/json",
      },
    }
  );
  readerModeSetting = await userReaderModeSetting.json();

  const userReaderModeData = readerModeSetting?.data
    ? readerModeSetting?.data
    : {};

  return {
    props: {
      userData: userData ? userData : null,
      readerModeSetting: userReaderModeData,
      keyTakeAwayList,
      keyTakeAwayNumbers,
      booksData: booksData || [],
      slug: details,
      locale,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
