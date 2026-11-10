"use client";

import {useState} from "react";
import dynamic from "next/dynamic";

// Static import for always-visible sidebar (critical)
import ProfileSidebar from "./components/profile-sidebar";
import type {ProfileTab} from "./components/profile-sidebar";

// Dynamic imports for tab components (user-specific, interactive)
const MyCoursesTab = dynamic(() => import("./components/my-courses-tab"), {
	ssr: false,
});

const ProfileInfoTab = dynamic(() => import("./components/profile-info-tab"), {
	ssr: false,
});

const MyPostsTab = dynamic(() => import("./components/my-posts-tab"), {
	ssr: false,
});

const SettingsTab = dynamic(() => import("./components/settings-tab"), {
	ssr: false,
});

// Main profile page - Arrow function
const MyProfilePage = () => {
	const [activeTab, setActiveTab] = useState<ProfileTab>("account");

	// Render tab content - Arrow function
	const renderTabContent = () => {
		switch (activeTab) {
			case "account":
				return <ProfileInfoTab />;
			case "courses":
				return <MyCoursesTab />;
			case "posts":
				return <MyPostsTab />;
			case "settings":
				return <SettingsTab />;
			default:
				return <ProfileInfoTab />;
		}
	};

	return (
		<div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
				{/* Sidebar */}
				<div className="lg:col-span-1">
					<ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
				</div>

				{/* Main Content */}
				<div className="lg:col-span-3">{renderTabContent()}</div>
			</div>
		</div>
	);
};

export default MyProfilePage;
