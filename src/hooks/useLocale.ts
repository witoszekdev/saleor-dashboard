import { useContext } from "react";
import { LocaleContext } from "../components/Locale/Locale";

function useLocale() {
  const localeInfo = useContext(LocaleContext);

  return localeInfo;
}
export { useLocale };
