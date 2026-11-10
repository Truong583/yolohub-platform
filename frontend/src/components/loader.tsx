import {cn} from "@/lib/utils";

// Loader.jsx
export default function Loader({message}: {message?: string}) {
	return (
		<div
			className={cn(
				"fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center"
			)}
		>
			<div className="w-[50px] h-[50px] border-[7px] border-double border-t-[#43cec7] border-r-transparent border-b-[#43cec7] border-l-transparent rounded-full flex items-center justify-center animate-spin">
				<div className="w-1/2 h-1/2 bg-[#43cec7] rounded-full"></div>
			</div>
			{message && (
				<p className="text-lg text-gray-600 font-medium animate-pulse">
					{message}
				</p>
			)}
		</div>
	);
}
