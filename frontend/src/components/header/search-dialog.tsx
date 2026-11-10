"use client";

import {Button} from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {getRoutes, ROUTE_CONFIG} from "@/configs/routes";
import {useSearch} from "@/hooks/use-search";
import {Search} from "lucide-react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function SearchDialog() {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();

	// Use real search functionality with TanStack Query
	const {
		data: searchData,
		isLoading: searchLoading,
		isFetching: searchFetching,
		isError: searchError,
	} = useSearch(searchQuery);

	const courses = searchData?.courses || [];
	const blogs = searchData?.blogs || [];

	// Handle search submission
	function handleSearchSubmit(query: string) {
		if (query.trim()) {
			setOpen(false);
			setSearchQuery("");
			router.push(getRoutes.searchWithQuery(query.trim()));
		}
	}

	// Handle item selection
	function handleItemSelect(type: "course" | "blog", slug: string) {
		setOpen(false);
		setSearchQuery("");
		if (type === "course") {
			router.push(getRoutes.courseDetail(slug));
		} else {
			router.push(getRoutes.blogDetail(slug));
		}
	}

	// Handle "View more" button clicks
	function handleViewMore(type: "course" | "blog") {
		setOpen(false);
		setSearchQuery("");
		if (type === "course") {
			router.push(ROUTE_CONFIG.COURSES);
		} else {
			router.push(ROUTE_CONFIG.BLOGS);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="relative h-8 w-8 sm:h-10 sm:w-10 p-0 text-gray-500 hover:text-blue-600 transition-all duration-300 group hover:bg-gradient-to-br hover:from-blue-50 hover:via-blue-100/50 hover:to-purple-50 hover:shadow-lg hover:shadow-blue-200/20 rounded-full border border-transparent hover:border-blue-100 focus:outline-none"
					aria-label="Open search dialog"
					aria-expanded={open}
					aria-haspopup="dialog"
				>
					<div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/8 group-hover:to-purple-500/8 rounded-full transition-all duration-300"></div>
					<Search
						size={16}
						className="sm:w-[18px] sm:h-[18px] relative z-10 group-hover:scale-110 transition-transform duration-300"
					/>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[95vw] sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Search Courses & Tutorials</DialogTitle>
				</DialogHeader>
				<div className="mt-4">
					<Command shouldFilter={false}>
						<CommandInput
							placeholder="Search courses, tutorials..."
							value={searchQuery}
							onValueChange={setSearchQuery}
							className="h-10 sm:h-12 text-base"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSearchSubmit(searchQuery);
								}
							}}
						/>
						<CommandList className="max-h-72 sm:max-h-96">
							{(searchLoading || searchFetching) && searchQuery.length >= 2 && (
								<div className="flex items-center justify-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
									<span className="ml-2 text-gray-600">Searching...</span>
								</div>
							)}

							{searchError && searchQuery.length >= 2 && (
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<Search className="h-12 w-12 text-red-400 mb-3" />
									<p className="text-lg font-medium text-red-600">
										An error occurred
									</p>
									<p className="text-sm text-gray-500">
										Please try again later
									</p>
								</div>
							)}

							{!searchLoading &&
								!searchFetching &&
								!searchError &&
								searchQuery.length >= 2 &&
								courses.length === 0 &&
								blogs.length === 0 && (
									<CommandEmpty>
										<div className="flex flex-col items-center justify-center py-8 text-center">
											<Search className="h-12 w-12 text-muted-foreground mb-3" />
											<p className="text-lg font-medium">No results found</p>
											<p className="text-sm text-muted-foreground">
												Try searching with different keywords
											</p>
											<button
												onClick={() => handleSearchSubmit(searchQuery)}
												className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
												aria-label={`View all search results for "${searchQuery}"`}
											>
												View all search results
											</button>
										</div>
									</CommandEmpty>
								)}

							{searchQuery.length < 2 && (
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<Search className="h-12 w-12 text-muted-foreground mb-3" />
									<p className="text-lg font-medium">
										Search courses and tutorials
									</p>
									<p className="text-sm text-muted-foreground">
										Enter at least 2 characters to start searching
									</p>
								</div>
							)}

							{/* Courses Group */}
							{!searchLoading && !searchFetching && courses.length > 0 && (
								<CommandGroup>
									<div className="flex items-center justify-between px-2 mb-2 py-3 sm:py-4 border-b">
										<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
											COURSES
										</h3>
										<button
											onClick={() => handleViewMore("course")}
											className="text-sm text-gray-500 hover:text-blue-600 transition-colors min-h-[44px] px-2"
											aria-label="View more courses"
										>
											View more
										</button>
									</div>
									{courses.slice(0, 3).map((course) => (
										<CommandItem
											key={course._id}
											value={course.title}
											onSelect={() => handleItemSelect("course", course.slug)}
											className="flex items-center gap-3 p-3 sm:p-2 hover:bg-gray-50 cursor-pointer border-none min-h-[60px] sm:min-h-[auto]"
										>
											<div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
												{course?.image ? (
													<Image
														src={course.image}
														alt={course?.title || "Course"}
														fill
														className="object-cover"
														sizes="48px"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center">
														<span className="text-white text-lg font-semibold">
															{course.title?.charAt(0)?.toUpperCase() || "C"}
														</span>
													</div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<div className="text-sm font-medium text-gray-900 truncate">
													{course?.title}
												</div>
											</div>
										</CommandItem>
									))}
								</CommandGroup>
							)}

							{/* Blogs Group */}
							{!searchLoading && !searchFetching && blogs.length > 0 && (
								<CommandGroup>
									<div className="flex items-center justify-between px-2 py-3 sm:p-4 border-b">
										<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
											TUTORIALS
										</h3>
										<button
											onClick={() => handleViewMore("blog")}
											className="text-sm text-gray-500 hover:text-blue-600 transition-colors min-h-[44px] px-2"
											aria-label="View more blog posts"
										>
											View more
										</button>
									</div>
									{blogs.slice(0, 3).map((blog) => (
										<CommandItem
											key={blog._id}
											value={blog.title}
											onSelect={() => handleItemSelect("blog", blog.slug)}
											className="flex items-center gap-3 p-3 sm:p-4 hover:bg-gray-50 cursor-pointer border-none min-h-[60px] sm:min-h-[auto]"
										>
											<div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-500 to-orange-400 flex-shrink-0">
												{blog?.thumbnail ? (
													<Image
														src={blog.thumbnail}
														alt={blog?.title || "Blog"}
														fill
														className="object-cover"
														sizes="48px"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center">
														<span className="text-white text-lg font-semibold">
															{blog.title?.charAt(0)?.toUpperCase() || "B"}
														</span>
													</div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<div className="text-sm font-medium text-gray-900 line-clamp-2 leading-relaxed">
													{blog?.title}
												</div>
											</div>
										</CommandItem>
									))}
								</CommandGroup>
							)}
						</CommandList>
					</Command>
				</div>
			</DialogContent>
		</Dialog>
	);
}
