import { themes } from "./model.js";

export const setTheme = () => {
  let themeType = "dark"; //暗色
  let themeConfig = themes[themeType];
  for (let key in themeConfig) {
    document.querySelector("html").style.setProperty(`--${key}`, themeConfig[key]);
  }
};
