import type React from "react";
import { formatDistance } from "../shared/utils/distance";
import type { Request } from "../shared/types/request";

type RequestCardProps = {
	request: Request;
	onSelect: (request: Request) => void;
	className?: string;
};

const RequestCard: React.FC<RequestCardProps> = ({
	request,
	onSelect,
	className,
}) => (
	<button
		type="button"
		className={`p-4 border rounded-xl bg-white shadow-sm text-left w-full ${className ?? ""}`}
		onClick={() => onSelect(request)}
	>
		<div className="flex justify-between items-start">
			<div>
				<div className="font-semibold">{request.description}</div>
			</div>
		</div>
		<div className="flex items-center justify-between mt-3 text-sm text-gray-500">
			<span>
				{request.distance !== undefined
					? `距離: ${formatDistance(request.distance)}`
					: "距離: 取得できません"}
			</span>
		</div>
	</button>
);

export default RequestCard;
