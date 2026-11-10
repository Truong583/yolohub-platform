"use client";

import {Button} from "@/components/ui/button";
import {MdAdd, MdArticle} from "react-icons/md";

// My posts tab component - Arrow function
const MyPostsTab = () => {
	// Mock data - replace with real data from your API
	const posts = [];

	return (
		<div className="space-y-6 sm:space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
				<div>
					<h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
						My Posts
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground">
						Manage your posts and content you&apos;ve created
					</p>
				</div>
				<Button className="flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto">
					<MdAdd className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
					Create New Post
				</Button>
			</div>

			{/* Posts Content */}
			{posts.length > 0 ? (
				<div className="grid gap-4 sm:gap-6">
					{/* Posts will be rendered here */}
				</div>
			) : (
				<div className="text-center py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
					<div className="mb-6 sm:mb-8">
						<div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center">
							<MdArticle className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-blue-600 dark:text-blue-400" />
						</div>
					</div>
					<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
						✍️ No Posts Yet
					</h3>
					<p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto mb-6 sm:mb-8">
						You haven&apos;t created any posts yet. Start sharing your knowledge
						and experience with the community!
					</p>
					<div className="flex justify-center">
						<Button className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
							<MdAdd className="h-4 w-4 sm:h-5 sm:w-5" />
							Create Your First Post
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyPostsTab;
