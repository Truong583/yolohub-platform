"use client";

import {Button} from "@/components/ui/button";
import {UploadDropzone} from "@/utils/uploadthing";
import Image from "next/image";
import {MdDelete} from "react-icons/md";

interface ImageUploadProps {
	value?: string;
	onChange: (url: string) => void;
	onError?: (error: string) => void;
	disabled?: boolean;
	label?: string;
}

export function ImageUpload({
	value,
	onChange,
	onError,
	disabled = false,
}: ImageUploadProps) {
	return (
		<div>
			{!value ? (
				<UploadDropzone
					endpoint="imageUploader"
					onClientUploadComplete={(res) => {
						console.log("Upload completed:", res);
						if (res?.[0]) {
							console.log("Setting image URL:", res[0].url);
							onChange(res[0].url);
						}
					}}
					onUploadError={(error: Error) => {
						console.error("Upload error:", error);
						onError?.(error.message);
					}}
					appearance={{
						button: "bg-primary w-full max-w-xs mx-auto px-8 py-3",
					}}
					config={{mode: "auto"}}
					className="py-4 !mt-0"
				/>
			) : (
				<div className="relative w-full max-w-sm mx-auto">
					<Image
						src={value}
						alt="Uploaded image"
						width={300}
						height={200}
						className="rounded-lg object-cover border w-full"
					/>
					<Button
						type="button"
						variant="destructive"
						size="sm"
						onClick={() => onChange("")}
						disabled={disabled}
						className="absolute top-2 right-2"
					>
						<MdDelete className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	);
}
