import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const TextWrapper = ({ text, textStyles, btnStyles, limit = 100, ...rest }) => {
  const [visible, setVisible] = useState(false);
  const {t:translate}= useTranslation()
  return (
    <div
      style={{
        cursor: "pointer",
        wordWrap: "break-all !important",
        whiteSpace: "initial !important",
        display: "inline",
        ...textStyles,
      }}
      onClick={() => setVisible(() => !visible)}
      {...rest}
    >
      {visible ? text : text.slice(0, limit)}
      {text.length > limit && (
        <>
          {visible || "..."}
          <button
            style={{
              background: "none",
              border: "none",
              paddingLeft: 5,
              paddingRight: 5,
              textDecoration: "underline",
              color: "inherit",
              fontSize: "inherit",
              ...btnStyles,
              cursor:"pointer"
            }}
          >
            {visible ? translate("SEE_LESS") : translate("SEE_MORE")}
          </button>
        </>
      )}
    </div>
  );
};

export default TextWrapper;
