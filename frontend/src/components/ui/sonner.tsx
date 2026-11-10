"use client";

import {useTheme} from "next-themes";
import {Toaster as Sonner, ToasterProps} from "sonner";

const Toaster = ({...props}: ToasterProps) => {
	const {theme = "system"} = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			position="top-right"
			expand={true}
			richColors={false}
			closeButton
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--success-bg": "var(--toast-success)",
					"--success-text": "var(--toast-success-fg)",
					"--success-border": "var(--toast-success)",
					"--error-bg": "var(--toast-error)",
					"--error-text": "var(--toast-error-fg)",
					"--error-border": "var(--toast-error)",
					"--warning-bg": "var(--toast-warning)",
					"--warning-text": "var(--toast-warning-fg)",
					"--warning-border": "var(--toast-warning)",
					"--info-bg": "var(--toast-info)",
					"--info-text": "var(--toast-info-fg)",
					"--info-border": "var(--toast-info)",
				} as React.CSSProperties
			}
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
			{...props}
		/>
	);
};

export {Toaster};
