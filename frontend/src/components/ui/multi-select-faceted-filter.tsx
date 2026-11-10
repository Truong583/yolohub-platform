"use client";

import * as React from "react";
import {CheckIcon, PlusCircledIcon} from "@radix-ui/react-icons";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Separator} from "@/components/ui/separator";

export interface Option {
	label: string;
	value: string;
	icon?: React.ComponentType<{className?: string}>;
	count?: number;
}

interface MultiSelectFacetedFilterProps {
	placeholder?: string;
	searchPlaceholder?: string;
	options: Option[];
	selectedValues: string[];
	onSelectionChange: (values: string[]) => void;
	disabled?: boolean;
	className?: string;
	maxDisplayItems?: number;
	showClearAll?: boolean;
	emptyMessage?: string;
}

export function MultiSelectFacetedFilter({
	placeholder = "Select options",
	searchPlaceholder = "Search...",
	options,
	selectedValues = [],
	onSelectionChange,
	disabled = false,
	className,
	maxDisplayItems = 2,
	showClearAll = true,
	emptyMessage = "No options found.",
}: MultiSelectFacetedFilterProps) {
	const selectedSet = new Set(selectedValues);

	const handleSelect = (value: string) => {
		const newValues = new Set(selectedValues);
		if (selectedSet.has(value)) {
			newValues.delete(value);
		} else {
			newValues.add(value);
		}
		onSelectionChange(Array.from(newValues));
	};

	const handleClearAll = () => {
		onSelectionChange([]);
	};

	return (
		<Popover modal={true}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn("w-full justify-start border-dashed", className)}
					disabled={disabled}
				>
					<PlusCircledIcon className="h-4 w-4" />
					{placeholder}
					{selectedSet.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal lg:hidden"
							>
								{selectedSet.size}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{selectedSet.size > maxDisplayItems ? (
									<Badge
										variant="secondary"
										className="rounded-sm px-1 font-normal"
									>
										{selectedSet.size} selected
									</Badge>
								) : (
									Array.from(selectedSet).map((value) => {
										const option = options.find((opt) => opt.value === value);
										return option ? (
											<Badge
												variant="secondary"
												key={value}
												className="rounded-sm px-1 font-normal"
											>
												{option.label}
											</Badge>
										) : null;
									})
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0" align="start">
				<Command>
					<CommandInput placeholder={searchPlaceholder} />
					<CommandList>
						<CommandEmpty>{emptyMessage}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedSet.has(option.value);
								return (
									<CommandItem
										key={option.value}
										onSelect={() => handleSelect(option.value)}
									>
										<div
											className={cn(
												"border-primary flex h-4 w-4 items-center justify-center rounded-sm border",
												isSelected
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible"
											)}
										>
											<CheckIcon className="h-4 w-4" />
										</div>
										{option.icon && (
											<option.icon className="h-4 w-4 text-muted-foreground" />
										)}
										<span>{option.label}</span>
										{option.count !== undefined && (
											<span className="ml-auto text-xs text-muted-foreground">
												{option.count}
											</span>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
						{showClearAll && selectedSet.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={handleClearAll}
										className="justify-center text-center"
									>
										Clear selection
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
