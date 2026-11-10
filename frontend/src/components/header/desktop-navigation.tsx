import {ROUTE_CONFIG} from "@/configs/routes";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {usePathname} from "next/navigation";

const navigation = [
	{name: "Courses", href: ROUTE_CONFIG.COURSES},
	{name: "Blogs", href: ROUTE_CONFIG.BLOGS},
	{name: "About", href: ROUTE_CONFIG.ABOUT},
	{name: "Contact", href: ROUTE_CONFIG.CONTACT},
	{name: "Demo", href: ROUTE_CONFIG.DEMO},
];

export function DesktopNavigation() {
	const pathname = usePathname();

	return (
		<nav
			className="hidden lg:flex items-center space-x-12 flex-1 justify-center"
			role="navigation"
			aria-label="Main navigation"
		>
			{navigation.map((item) => {
				const isActive =
					pathname === item.href ||
					(item.href !== "/" && pathname.startsWith(item.href));

				return (
					<Link
						key={item.name}
						href={item.href}
						className={cn(
							"relative font-semibold text-base transition-all duration-200 group py-2 focus:outline-none rounded-md px-2",
							isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
						)}
						aria-current={isActive ? "page" : undefined}
					>
						{item.name}
						<span
							className={cn(
								"absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 rounded-full",
								isActive ? "w-full" : "w-0 group-hover:w-full"
							)}
						></span>
					</Link>
				);
			})}
		</nav>
	);
}
