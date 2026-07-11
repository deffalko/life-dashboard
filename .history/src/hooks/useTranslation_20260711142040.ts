// src/hooks/useTranslation.ts
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { t, TranslationKey } from "../utils/translations";

export const useTranslation = () => {
  const { currentLanguage } = useSelector((state: RootState) => state.language);

  const translate = (key: TranslationKey): string => {
    return t(key, currentLanguage);
  };

  return { translate, currentLanguage };
};
