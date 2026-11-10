import {ApiService} from "@/lib/api-service";
import type {
	ITrack,
	CreateTrackRequest,
	DeleteTrackRequest,
	ToggleTrackRequest,
	CourseTracksResponse,
} from "@/types/track";

const ENDPOINTS = {
	TRACKS: "/tracks",
	TOGGLE_TRACK: "/tracks/toggle",
	TRACK: (id: string) => `/tracks/${id}`,
	DELETE_BY_LESSON: "/tracks/lesson",
} as const;

export class TrackService {
	// Create track
	static async createTrack(data: CreateTrackRequest): Promise<ITrack> {
		return ApiService.post<ITrack, CreateTrackRequest>(ENDPOINTS.TRACKS, data);
	}

	// Delete track
	static async deleteTrack(data: DeleteTrackRequest): Promise<void> {
		return ApiService.delete<void>(ENDPOINTS.DELETE_BY_LESSON, data);
	}

	// Toggle track (create if not completed, delete if completed)
	static async toggleTrack(data: ToggleTrackRequest): Promise<ITrack | void> {
		return ApiService.post<ITrack, ToggleTrackRequest>(
			ENDPOINTS.TOGGLE_TRACK,
			data
		);
	}

	// Get course tracks for user
	static async getCourseTracksForUser(
		courseId: string
	): Promise<CourseTracksResponse> {
		try {
			const response = await ApiService.get<ITrack[]>(ENDPOINTS.TRACKS, {
				courseId,
			} as Record<string, unknown>);

			const tracks = response || [];
			const completedLessons = tracks.map((track) => track.lessonId);
			const completedCount = tracks.length;

			return {
				tracks,
				completedLessons,
				completionPercentage: 0,
				totalLessons: 0,
				completedCount,
			};
		} catch {
			return {
				tracks: [],
				completedLessons: [],
				completionPercentage: 0,
				totalLessons: 0,
				completedCount: 0,
			};
		}
	}

	// Get track by ID
	static async getTrack(id: string): Promise<ITrack> {
		return ApiService.get<ITrack>(ENDPOINTS.TRACK(id));
	}

	// Get all tracks
	static async getAllTracks(): Promise<ITrack[]> {
		try {
			return await ApiService.get<ITrack[]>(ENDPOINTS.TRACKS);
		} catch {
			return [];
		}
	}
}

export default TrackService;
