"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";
import {Clock, ChevronDownIcon, CheckIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

interface SimpleTimeOption {
	value: number;
	label: string;
	disabled?: boolean;
}

interface SimpleTimePickerProps {
	value?: string; // Format: "HH:mm:ss"
	onChange: (value: string) => void;
	disabled?: boolean;
}

export function SimpleTimePicker({
	value = "00:00:00",
	onChange,
	disabled = false,
}: SimpleTimePickerProps) {
	const [open, setOpen] = useState(false);
	const isInternalChange = useRef(false);

	// Parse time string to individual components
	const parseTime = useCallback((timeStr: string) => {
		const parts = timeStr.split(":");
		return {
			hour: parseInt(parts[0]) || 0,
			minute: parseInt(parts[1]) || 0,
			second: parseInt(parts[2]) || 0,
		};
	}, []);

	const {
		hour: currentHour,
		minute: currentMinute,
		second: currentSecond,
	} = parseTime(value);

	const [hour, setHour] = useState(currentHour);
	const [minute, setMinute] = useState(currentMinute);
	const [second, setSecond] = useState(currentSecond);

	const hourRef = useRef<HTMLDivElement>(null);
	const minuteRef = useRef<HTMLDivElement>(null);
	const secondRef = useRef<HTMLDivElement>(null);

	// Update internal state when value prop changes
	useEffect(() => {
		if (!isInternalChange.current) {
			const parsed = parseTime(value);
			setHour(parsed.hour);
			setMinute(parsed.minute);
			setSecond(parsed.second);
		}
		isInternalChange.current = false;
	}, [value, parseTime]);

	// Update parent when internal state changes
	useEffect(() => {
		const timeString = `${hour.toString().padStart(2, "0")}:${minute
			.toString()
			.padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
		if (timeString !== value) {
			isInternalChange.current = true;
			onChange(timeString);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hour, minute, second, value]);

	// Scroll to selected items when opened
	useEffect(() => {
		if (open) {
			setTimeout(() => {
				hourRef.current?.scrollIntoView({
					block: "center",
					behavior: "smooth",
				});
				minuteRef.current?.scrollIntoView({
					block: "center",
					behavior: "smooth",
				});
				secondRef.current?.scrollIntoView({
					block: "center",
					behavior: "smooth",
				});
			}, 100);
		}
	}, [open]);

	const hours: SimpleTimeOption[] = useMemo(
		() =>
			Array.from({length: 24}, (_, i) => ({
				value: i,
				label: i.toString().padStart(2, "0"),
				disabled: false,
			})),
		[]
	);

	const minutes: SimpleTimeOption[] = useMemo(
		() =>
			Array.from({length: 60}, (_, i) => ({
				value: i,
				label: i.toString().padStart(2, "0"),
				disabled: false,
			})),
		[]
	);

	const seconds: SimpleTimeOption[] = useMemo(
		() =>
			Array.from({length: 60}, (_, i) => ({
				value: i,
				label: i.toString().padStart(2, "0"),
				disabled: false,
			})),
		[]
	);

	const onHourChange = useCallback((v: SimpleTimeOption) => {
		setHour(v.value);
	}, []);

	const onMinuteChange = useCallback((v: SimpleTimeOption) => {
		setMinute(v.value);
	}, []);

	const onSecondChange = useCallback((v: SimpleTimeOption) => {
		setSecond(v.value);
	}, []);

	const display = useMemo(() => {
		return `${hour.toString().padStart(2, "0")}:${minute
			.toString()
			.padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
	}, [hour, minute, second]);

	return (
		<Popover open={open} onOpenChange={setOpen} modal={true}>
			<PopoverTrigger asChild>
				<div
					role="button"
					aria-expanded={open}
					className={cn(
						"flex h-9 px-3 items-center justify-between cursor-pointer bg-background font-normal border border-input rounded-md text-sm shadow-sm",
						disabled && "opacity-50 cursor-not-allowed"
					)}
					tabIndex={0}
				>
					<div className="flex items-center">
						<Clock className="mr-2 size-4" />
						<span>{display}</span>
					</div>
					<ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
				</div>
			</PopoverTrigger>
			<PopoverContent className="p-0" side="top">
				<div className="flex-col gap-2 p-2">
					<div className="flex h-56 grow">
						{/* Hours */}
						<ScrollArea className="h-full flex-grow">
							<div className="flex  flex-col  overflow-y-auto  ">
								{hours.map((v) => (
									<div
										ref={v.value === hour ? hourRef : undefined}
										key={v.value}
									>
										<TimeItem
											option={v}
											selected={v.value === hour}
											onSelect={onHourChange}
											disabled={v.disabled}
											className="h-8"
										/>
									</div>
								))}
							</div>
						</ScrollArea>

						{/* Minutes */}
						<ScrollArea className="h-full flex-grow">
							<div className="flex grow flex-col items-stretch overflow-y-auto pe-2 pb-48">
								{minutes.map((v) => (
									<div
										ref={v.value === minute ? minuteRef : undefined}
										key={v.value}
									>
										<TimeItem
											option={v}
											selected={v.value === minute}
											onSelect={onMinuteChange}
											disabled={v.disabled}
											className="h-8"
										/>
									</div>
								))}
							</div>
						</ScrollArea>

						{/* Seconds */}
						<ScrollArea className="h-full flex-grow">
							<div className="flex grow flex-col items-stretch overflow-y-auto pe-2 pb-48">
								{seconds.map((v) => (
									<div
										ref={v.value === second ? secondRef : undefined}
										key={v.value}
									>
										<TimeItem
											option={v}
											selected={v.value === second}
											onSelect={onSecondChange}
											className="h-8"
											disabled={v.disabled}
										/>
									</div>
								))}
							</div>
						</ScrollArea>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

const TimeItem = ({
	option,
	selected,
	onSelect,
	className,
	disabled,
}: {
	option: SimpleTimeOption;
	selected: boolean;
	onSelect: (option: SimpleTimeOption) => void;
	className?: string;
	disabled?: boolean;
}) => {
	return (
		<Button
			variant="ghost"
			className={cn("flex justify-center px-1 pe-2 ps-1", className)}
			onClick={() => onSelect(option)}
			disabled={disabled}
		>
			<div className="flex items-center justify-center size-4">
				{selected && <CheckIcon className="size-4" />}
			</div>
			<span className="ms-2">{option.label}</span>
		</Button>
	);
};
