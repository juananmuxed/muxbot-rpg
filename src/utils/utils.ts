import { LanguageModule } from "./../types/ILanguage";

import path from "path";
export const sleep = async (s: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000 * s);
  });
};

export const _ = (string: string, lang: string): string => {
  const languagePath = path.join(__dirname, "../language/");
  const file: LanguageModule | undefined =
    lang != "en" ? require(languagePath + lang + ".js") : undefined;

  return !file || !file.default.strings[string]
    ? string
    : file.default.strings[string];
};

export const randomColor = (brightness: number = 120) => {
  function randomChannel(brightness: number) {
    var r = 255 - brightness;
    var n = 0 | (Math.random() * r + brightness);
    var s = n.toString(16);
    return s.length == 1 ? "0" + s : s;
  }
  return (
    "#" +
    randomChannel(brightness) +
    randomChannel(brightness) +
    randomChannel(brightness)
  );
};
