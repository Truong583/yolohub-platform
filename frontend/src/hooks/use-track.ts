"use client";

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import TrackService from "@/services/track";
import {
	CreateTrackRequest,
	DeleteTrackRequest,
	ToggleTrackRequest,
} from "@/types/track";

// Query keys for track
export const trackKeys = {
	all: ["track"] as const,
	courseTracks: (courseId: string) =>
		[...trackKeys.all, "course", courseId] as const,
	track: (id: string) => [...trackKeys.all, "detail", id] as const,
} as const;

// Hook to get user's completion tracks for a specific course
export function useUserCourseTracks(courseId: string) {
	return useQuery({
		queryKey: trackKeys.courseTracks(courseId),
		queryFn: () => TrackService.getCourseTracksForUser(courseId),
		enabled: !!courseId, // Only run if courseId is provided
	});
}

// Hook to get a single track by ID
export function useTrack(id: string) {
	return useQuery({
		queryKey: trackKeys.track(id),
		queryFn: () => TrackService.getTrack(id),
		enabled: !!id,
	});
}

// Hook to create a track (mark lesson as completed)
export function useCreateTrack() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateTrackRequest) => TrackService.createTrack(data),
		onSuccess: (data, variables) => {
			// Invalidate the course tracks query to refetch
			queryClient.invalidateQueries({
				queryKey: trackKeys.courseTracks(variables.courseId),
			});

			// Optionally show success toast
			toast.success("Lesson marked as completed!");
		},
		onError: (error) => {
			console.error("Failed to create track:", error);
			toast.error("Unable to mark lesson as completed");
		},
	});
}

// Hook to delete a track (mark lesson as uncompleted)
export function useDeleteTrack() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: DeleteTrackRequest) => TrackService.deleteTrack(data),
		onSuccess: (data, variables) => {
			// Invalidate the course tracks query to refetch
			queryClient.invalidateQueries({
				queryKey: trackKeys.courseTracks(variables.courseId),
			});

			// Optionally show success toast
			toast.success("Lesson completion mark removed!");
		},
		onError: (error) => {
			console.error("Failed to delete track:", error);
			toast.error("Unable to remove lesson completion mark");
		},
	});
}

// Custom hook for track toggling
export function useToggleTrack() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ToggleTrackRequest) => TrackService.toggleTrack(data),
		onSuccess: (data, variables) => {
			// Invalidate the course tracks query to refetch
			queryClient.invalidateQueries({
				queryKey: trackKeys.courseTracks(variables.courseId),
			});

			// Show success toast
			toast.success("Lesson status updated!");
		},
		onError: (error) => {
			console.error("Failed to toggle track:", error);
			toast.error("Unable to change lesson status");
		},
	});
}
