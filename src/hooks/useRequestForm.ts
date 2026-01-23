import { useCallback, useState } from "react";

type RequestFormOptions = {
	onSubmit: (text: string) => void;
	onError: (message: string) => void;
};

export const useRequestForm = ({ onSubmit, onError }: RequestFormOptions) => {
	const [requestText, setRequestText] = useState("");

	const handleSubmit = useCallback(() => {
		if (!requestText.trim()) {
			onError("依頼内容を入力してください");
			return;
		}

		onSubmit(requestText);
	}, [onError, onSubmit, requestText]);

	return { handleSubmit, requestText, setRequestText };
};
