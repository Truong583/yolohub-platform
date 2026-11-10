"use client";

import dynamic from "next/dynamic";

import {HeaderLogo} from "../header/header-logo";
import {DesktopNavigation} from "../header/desktop-navigation";
import {NotificationBar} from "../header/notification-bar";

// Dynamically import interactive components that don't need immediate rendering
// These components require user interaction, so we can defer their loading
const MobileMenu = dynamic(() => import("../header/mobile-menu"), {
	ssr: false,
	loading: () => (
		<div className="lg:hidden h-10 w-10 p-0 animate-pulse bg-gray-200 rounded" />
	),
});

const SearchDialog = dynamic(() => import("../header/search-dialog"), {
	ssr: false,
	loading: () => (
		<div className="h-8 w-8 sm:h-10 sm:w-10 animate-pulse bg-gray-200 rounded-full" />
	),
});

const CartTooltip = dynamic(() => import("../header/cart-tooltip"), {
	ssr: false,
	loading: () => (
		<div className="h-8 w-8 sm:h-10 sm:w-10 animate-pulse bg-gray-200 rounded-full" />
	),
});

const AuthSection = dynamic(() => import("../header/auth-section"), {
	ssr: false,
	loading: () => (
		<div className="flex items-center gap-1 sm:gap-2">
			<div className="h-8 sm:h-10 w-16 sm:w-20 animate-pulse bg-gray-200 rounded-xl" />
			<div className="h-8 sm:h-10 w-20 sm:w-28 animate-pulse bg-gray-200 rounded-xl" />
		</div>
	),
});

function MainHeader() {
	return (
		<header className="sticky top-0 z-50 w-full">
			{/* Enhanced background with gradient and glass effect */}
			<div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 backdrop-blur-xl"></div>
			<div className="absolute inset-0 bg-white/90 backdrop-blur-xl"></div>
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-purple-500/5"></div>

			{/* Subtle border with gradient */}
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

			{/* Content container */}
			<div className="relative z-10">
				{/* Top notification bar */}
				<NotificationBar />

				{/* Main header */}
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 sm:h-18 items-center justify-between gap-2 sm:gap-4 lg:gap-6">
						{/* Mobile Menu Button & Logo Container */}
						<div className="flex items-center gap-3">
							<MobileMenu />
							<HeaderLogo />
						</div>

						{/* Desktop Navigation */}
						<DesktopNavigation />

						{/* Actions */}
						<div className="flex items-center gap-1 sm:gap-2 lg:gap-3 min-w-fit">
							<SearchDialog />
							<CartTooltip />
							<AuthSection />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

export default MainHeader;
