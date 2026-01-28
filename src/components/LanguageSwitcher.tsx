import type React from "react";
import { useTranslation, LANGUAGES } from "../shared/context/LanguageContext";

const LanguageSwitcher: React.FC = () => {
	const { language, setLanguage } = useTranslation();

	const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedLang = e.target
			.value as (typeof LANGUAGES)[keyof typeof LANGUAGES];
		setLanguage(selectedLang);
	};

	return (
		<select
			value={language}
			onChange={handleLanguageChange}
			className="ml-2 p-1 border border-gray-300 rounded-md bg-white text-sm"
			aria-label="Select language"
		>
			<option value={LANGUAGES.JA}>日本語</option>
			<option value={LANGUAGES.EN}>English</option>
		</select>
	);
};

export default LanguageSwitcher;
