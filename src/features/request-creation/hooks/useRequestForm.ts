import { useCallback, useState } from "react";

type RequestFormOptions = {
	onSubmit: (text: string) => void;
	onError: (message: string) => void;
};

export const getRequestTextError = (text: string) => {
	if (!text.trim()) {
		return "依頼内容を入力してください";
	}

	return null;
};

export const useRequestForm = ({ onSubmit, onError }: RequestFormOptions) => {
	const [requestText, setRequestText] = useState("");

	const handleSubmit = useCallback(() => {
		const errorMessage = getRequestTextError(requestText);
		if (errorMessage) {
			onError(errorMessage);
			return;
		}

		onSubmit(requestText);
	}, [onError, onSubmit, requestText]);

	return { handleSubmit, requestText, setRequestText };
};
