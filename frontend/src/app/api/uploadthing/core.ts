import {createUploadthing, type FileRouter} from "uploadthing/next";

const f = createUploadthing({
	errorFormatter: (err) => {
		console.log("Error uploading file", err.message);
		console.log("  - Above error caused by:", err.cause);

		return {message: err.message};
	},
});

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({image: {maxFileSize: "4MB"}})
		// Set permissions and file types for this FileRoute
		.middleware(async () => {
			// This code runs on your server before upload
			// You can add authentication here if needed

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return {uploadedBy: "user"};
		})
		.onUploadComplete(async ({metadata, file}) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log("Upload complete for userId:", metadata.uploadedBy);
			console.log("file url", file.url);

			// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
			return {uploadedBy: metadata.uploadedBy, url: file.url};
		}),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
