import { createCn } from "cn/config";

const viewportStyles = ["desktop-", "tablet-", "mobile-"];

export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{
        text: [
          (value) => viewportStyles.some((prefix) => value.startsWith(prefix)),
          "badge-tab",
          "button-large",
          "button-medium",
          "button-small",
          "placeholder",
        ],
      }],
    },
  },
});
