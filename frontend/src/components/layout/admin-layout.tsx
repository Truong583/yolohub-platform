"use client";

import {AdminSidebar} from "@/components/admin/admin-sidebar";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {MdNotifications, MdSearch} from "react-icons/md";
import {UserNav} from "@/components/auth/user-nav";
import {useEffect, useState, useRef} from "react";

interface AdminLayoutProps {
	children: React.ReactNode;
	title?: string;
	actions?: React.ReactNode;
	showTopActions?: boolean;
}

function AdminHeader({
	title = "Admin Panel",
	actions,
	showTopActions = true,
	scrollContainerRef,
}: {
	title?: string;
	actions?: React.ReactNode;
	showTopActions?: boolean;
	scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}) {
	const [offset, setOffset] = useState(0);

	useEffect(() => {
		const scrollContainer = scrollContainerRef?.current;
		if (!scrollContainer) return;

		const onScroll = () => {
			const scrollTop = scrollContainer.scrollTop;
			setOffset(scrollTop);
			// Debug: uncomment to see scroll values
			// console.log("Scroll offset:", scrollTop);
		};

		// Add scroll listener to the scrollable container
		scrollContainer.addEventListener("scroll", onScroll, {passive: true});

		// Clean up the event listener on unmount
		return () => scrollContainer.removeEventListener("scroll", onScroll);
	}, [scrollContainerRef]);

	return (
		<header
			className={`
        flex h-16 shrink-0 items-center gap-2 border-b px-4
        sticky top-0 z-10 transition-all duration-200
        ${
					offset > 0
						? "shadow-md backdrop-blur-md bg-background/95 border-border"
						: "bg-background border-border"
				}
      `}
		>
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 h-4" />

			<div className="flex-1 flex items-center justify-between">
				<h1 className="text-lg font-semibold">{title}</h1>

				<div className="flex items-center gap-2">
					{/* Custom actions */}
					{actions}

					{/* Default top actions - now always visible */}
					{showTopActions && (
						<>
							<Button variant="ghost" size="icon" title="Search">
								<MdSearch className="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="icon" title="Notifications">
								<MdNotifications className="h-4 w-4" />
							</Button>
							<UserNav />
						</>
					)}
				</div>
			</div>
		</header>
	);
}

export function AdminLayout({
	children,
	title,
	actions,
	showTopActions = true,
}: AdminLayoutProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Prevent body scrolling when admin layout is mounted
	useEffect(() => {
		// Store original overflow style
		const originalOverflow = document.body.style.overflow;

		// Prevent body scroll
		document.body.style.overflow = "hidden";

		// Cleanup on unmount
		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, []);

	return (
		<SidebarProvider>
			<div className="fixed inset-0 flex w-full h-full overflow-hidden bg-background">
				<AdminSidebar />
				<div
					ref={scrollContainerRef}
					className="flex-1 overflow-y-auto overflow-x-hidden h-full"
				>
					<AdminHeader
						title={title}
						actions={actions}
						showTopActions={showTopActions}
						scrollContainerRef={scrollContainerRef}
					/>
					<main className="p-6 bg-muted/10">{children}</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
