"use client";

import {Button} from "@/components/ui/button";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {MdMenu, MdNotifications, MdSearch} from "react-icons/md";
import {Input} from "@/components/ui/input";
import {UserNav} from "@/components/auth/user-nav";

interface AdminHeaderProps {
	title: string;
}

export function AdminHeader({title}: AdminHeaderProps) {
	return (
		<header className="flex h-16 items-center justify-between border-b bg-background px-6">
			<div className="flex items-center gap-4">
				<SidebarTrigger>
					<MdMenu className="h-4 w-4" />
				</SidebarTrigger>
				<h1 className="text-xl font-semibold">{title}</h1>
			</div>

			<div className="flex items-center gap-4">
				<div className="relative hidden md:block">
					<MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input placeholder="Search..." className="w-64 pl-10" />
				</div>

				<Button variant="ghost" size="icon">
					<MdNotifications className="h-4 w-4" />
				</Button>

				<UserNav />
			</div>
		</header>
	);
}
