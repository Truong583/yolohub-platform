"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface VideoModalProps {
	isOpen: boolean;
	onClose: () => void;
	videoUrl: string | null;
	title?: string;
}

function VideoModal({isOpen, onClose, videoUrl, title}: VideoModalProps) {
	const getVideoEmbedUrl = (url: string) => {
		// Convert YouTube watch URL to embed URL
		if (url.includes("youtube.com/watch")) {
			const videoId = url.split("v=")[1]?.split("&")[0];
			return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
		}
		// Convert short YouTube URLs
		if (url.includes("youtu.be/")) {
			const videoId = url.split("youtu.be/")[1]?.split("?")[0];
			return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
		}
		// If already an embed URL or other video URL
		return url;
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-5xl p-0 bg-black border-none overflow-hidden"
			>
				<DialogHeader className="sr-only">
					<DialogTitle>{title || "Video Preview"}</DialogTitle>
				</DialogHeader>
				<div className="relative aspect-video w-full bg-black">
					{isOpen && videoUrl && (
						<iframe
							src={getVideoEmbedUrl(videoUrl)}
							className="w-full h-full"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							title={title || "Video Preview"}
						/>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default VideoModal;
