import type React from "react";
import {
	createContext,
	useContext,
	useState,
	type ReactNode,
	useEffect,
} from "react";

import jaTranslations from "../locales/ja.json";
import enTranslations from "../locales/en.json";
import { STORAGE_KEYS } from "../constants/storage";

const LANGUAGES = {
	JA: "JA",
	EN: "EN",
} as const;

type LanguageCode = keyof typeof LANGUAGES;

type Translations = typeof jaTranslations;

interface LanguageContextProps {
	language: LanguageCode;
	setLanguage: (lang: LanguageCode) => void;
	t: (key: keyof Translations, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
	undefined,
);

const TRANSLATIONS: Record<LanguageCode, Translations> = {
	JA: jaTranslations,
	EN: enTranslations,
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [language, setLanguage] = useState<LanguageCode>(() => {
		const savedLanguage = localStorage.getItem(
			STORAGE_KEYS.language,
		) as LanguageCode | null;
		const browserLanguage = navigator.language.startsWith("ja")
			? LANGUAGES.JA
			: LANGUAGES.EN;

		return savedLanguage || browserLanguage;
	});

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.language, language);
	}, [language]);

	const t = (
		key: keyof Translations,
		params?: Record<string, string>,
	): string => {
		const translation = TRANSLATIONS[language][key];

		if (!translation) {
			console.warn(
				`Translation key '${String(key)}' not found for language '${language}'`,
			);
		}

		if (params) {
			let translated = translation;
			Object.entries(params).forEach(([paramKey, paramValue]) => {
				translated = translated.replace(`{${paramKey}}`, paramValue);
			});
			return translated;
		}

		return translation;
	};

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useTranslation = (): LanguageContextProps => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useTranslation must be used within a LanguageProvider");
	}
	return context;
};

export { LANGUAGES };
