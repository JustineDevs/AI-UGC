/**
 * API Client Service
 *
 * Centralized HTTP client for API communication.
 * Provides base configuration and error handling.
 */

import axios, { AxiosError, AxiosInstance } from "axios";
import type { ApiResponseEnvelope } from "@ai-ugc/contracts";
import { ModerationStatus } from "../types";
import type {
  ProviderCapability,
  ProviderValidationResult,
  SavedProviderProfile,
} from "../features/providers/types";

export type ApiResponse<T> = ApiResponseEnvelope<T>;

function normalizePayload<T>(payload: T): T {
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    "data" in payload &&
    (payload as { success?: boolean }).success === true
  ) {
    return (payload as { data: T }).data;
  }

  return payload;
}

function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (response.success) {
    return normalizePayload(response.data);
  }

  throw new Error(response.error.message);
}

/**
 * API Client class
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
      timeout: 120000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          console.error("API Error:", error.response.data);
        } else if (error.request) {
          console.error("Network Error:", error.message);
        } else {
          console.error("Request Error:", error.message);
        }
        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url);
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data;
  }

  async put(url: string, data: Blob, contentType: string): Promise<void> {
    await axios.put(url, data, {
      headers: {
        "Content-Type": contentType,
      },
    });
  }

  async uploadFile(
    presignedUrl: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(Math.round(progress));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload aborted"));
      });

      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  }
}

export const api = new ApiClient();

export interface Session {
  sessionId: string;
  createdAt: string;
  lastActivityAt: string;
  status: string;
}

export async function createSession(): Promise<Session> {
  const response = await api.post<{ sessionId: string; session: Session }>(
    "/sessions",
  );

  const data = unwrapApiResponse(response);
  return data.session;
}

export interface UploadVideoRequest {
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface UploadVideoResponse {
  uploadUrl: string;
  uploadFields: Record<string, string>;
  s3Key: string;
}

export interface WorkspaceTemplateRecord {
  id: string;
  name: string;
  slug: string;
  defaultProviderProfileId: string;
  storageProfileId: string;
  enabledNichePackKeys: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlueprintRecord {
  id: string;
  workspaceTemplateId: string;
  nichePackKey?: string;
  name: string;
  version: number;
  status: "draft" | "active" | "archived";
  providerPolicy: Record<string, unknown>;
  intakeSchema: Record<string, unknown>;
  stepGraph: Record<string, unknown>;
  promptAssemblyConfig: Record<string, unknown>;
  moderationPolicy: Record<string, unknown>;
  outputPolicy: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectProfileRecord {
  id: string;
  workspaceTemplateId: string;
  workflowBlueprintId: string;
  name: string;
  brandVoice: string;
  audience: string;
  offerDetails: string;
  claimsPolicy: Record<string, unknown>;
  channelTargets: string[];
  forbiddenTerms: string[];
  assetConstraints: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationSessionRecord {
  id: string;
  projectProfileId: string;
  workflowBlueprintSnapshot: Record<string, unknown>;
  status: string;
  channelTarget: string;
  campaignInputs: Record<string, unknown>;
  providerRoutingTrace: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export async function uploadVideo(
  sessionId: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<void> {
  const formData = new FormData();
  formData.append("video", file);

  await axios.post(
    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/sessions/${sessionId}/video/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(Math.round(progress));
        }
      },
    },
  );
}

export interface VideoAnalysis {
  analysisId: string;
  analyzedAt: string;
  status: "pending" | "processing" | "complete" | "failed";
  sceneBreakdown: string;
  userEdits?: string;
  error?: {
    code: string;
    message: string;
    timestamp: string;
  };
}

export async function triggerAnalysis(
  sessionId: string,
): Promise<{ analysisId: string; status: string }> {
  const response = await api.post<{ analysisId: string; status: string }>(
    `/sessions/${sessionId}/analysis`,
  );

  return unwrapApiResponse(response);
}

export async function getAnalysisStatus(
  sessionId: string,
): Promise<VideoAnalysis> {
  const response = await api.get<VideoAnalysis>(
    `/sessions/${sessionId}/analysis`,
  );
  return unwrapApiResponse(response);
}

export interface UpdateAnalysisRequest {
  editedText: string;
}

export async function updateAnalysis(
  sessionId: string,
  editedText: string,
): Promise<VideoAnalysis> {
  const response = await api.patch<VideoAnalysis>(
    `/sessions/${sessionId}/analysis`,
    {
      editedText,
    },
  );

  return unwrapApiResponse(response);
}

export interface SubmitProductInfoRequest {
  productName: string;
  productDescription: string;
}

export async function submitProductInfo(
  sessionId: string,
  productName: string,
  productDescription: string,
): Promise<void> {
  const response = await api.post(`/sessions/${sessionId}/product`, {
    productName,
    productDescription,
  });

  unwrapApiResponse(response);
}

export async function createWorkspaceTemplate(payload: {
  name: string;
  slug: string;
  enabledNichePackKeys: string[];
}): Promise<WorkspaceTemplateRecord> {
  const response = await api.post<WorkspaceTemplateRecord>(
    "/workspaces",
    payload,
  );
  return unwrapApiResponse(response);
}

export async function createBlueprint(
  workspaceId: string,
  payload: {
    name: string;
    nichePackKey?: string;
    intakeSchema: Record<string, unknown>;
    stepGraph: Record<string, unknown>;
  },
): Promise<BlueprintRecord> {
  const response = await api.post<BlueprintRecord>(
    `/workspaces/${workspaceId}/blueprints`,
    payload,
  );
  return unwrapApiResponse(response);
}

export async function createProjectProfile(
  workspaceId: string,
  payload: {
    name: string;
    workflowBlueprintId: string;
    brandVoice: string;
    audience: string;
    offerDetails: string;
    channelTargets: string[];
  },
): Promise<ProjectProfileRecord> {
  const response = await api.post<ProjectProfileRecord>(
    `/workspaces/${workspaceId}/projects`,
    payload,
  );
  return unwrapApiResponse(response);
}

export async function createGenerationSession(
  projectId: string,
  payload: {
    channelTarget: string;
    campaignInputs?: Record<string, unknown>;
  },
): Promise<GenerationSessionRecord> {
  const response = await api.post<GenerationSessionRecord>(
    `/projects/${projectId}/sessions`,
    payload,
  );
  return unwrapApiResponse(response);
}

export async function runGenerationSession(
  sessionId: string,
): Promise<GenerationSessionRecord> {
  const response = await api.post<GenerationSessionRecord>(
    `/sessions/${sessionId}/run`,
  );
  return unwrapApiResponse(response);
}

export interface GenerationPrompt {
  promptId: string;
  generatedText: string;
  userEditedText?: string;
  finalText: string;
  characterCount: number;
  generatedAt: string;
  approvedAt?: string;
  moderationStatus: ModerationStatus;
  moderationFlags?: string[];
}

export async function generatePrompt(
  sessionId: string,
): Promise<GenerationPrompt> {
  const response = await api.post<GenerationPrompt>(
    `/sessions/${sessionId}/prompt`,
  );
  return unwrapApiResponse(response);
}

export async function updatePrompt(
  sessionId: string,
  editedText: string,
): Promise<GenerationPrompt> {
  const response = await api.patch<GenerationPrompt>(
    `/sessions/${sessionId}/prompt`,
    {
      editedText,
    },
  );

  return unwrapApiResponse(response);
}

export async function approvePrompt(
  sessionId: string,
): Promise<GenerationPrompt> {
  const response = await api.post<GenerationPrompt>(
    `/sessions/${sessionId}/prompt/approve`,
  );

  return unwrapApiResponse(response);
}

export interface UploadProductImageRequest {
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export async function uploadProductImage(
  sessionId: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<void> {
  const formData = new FormData();
  formData.append("image", file);

  await axios.post(
    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/sessions/${sessionId}/product/image/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(Math.round(progress));
        }
      },
    },
  );
}

export interface GeneratedVideo {
  generatedVideoId: string;
  s3Key: string;
  s3Bucket: string;
  fileName: string;
  fileSize?: number;
  mimeType: string;
  status: "pending" | "processing" | "complete" | "failed";
  initiatedAt: string;
  completedAt?: string;
  estimatedCompletionTime?: string;
  downloadUrl?: string;
  error?: {
    code: string;
    message: string;
    timestamp: string;
    retryable: boolean;
  };
}

export async function generateVideo(
  sessionId: string,
): Promise<GeneratedVideo> {
  const response = await api.post<GeneratedVideo>(
    `/sessions/${sessionId}/generate`,
  );
  return unwrapApiResponse(response);
}

export async function getGeneratedVideoStatus(
  sessionId: string,
): Promise<GeneratedVideo> {
  const response = await api.get<GeneratedVideo>(
    `/sessions/${sessionId}/generate`,
  );
  return unwrapApiResponse(response);
}

export const getVideoStatus = getGeneratedVideoStatus;

export interface ValidateProviderPayload {
  providerKey: string;
  apiKey: string;
  baseUrl: string;
  textModel?: string;
  videoModel?: string;
}

export interface UpsertProviderProfilePayload {
  providerKey: string;
  displayName: string;
  baseUrl: string;
  apiKeySecretRef: string;
  defaultTextModel: string;
  defaultVideoModel: string;
  defaultImageModel?: string;
  enabledCapabilities: ProviderCapability[];
  fallbackPriority?: number;
}

export async function validateProvider(
  payload: ValidateProviderPayload,
): Promise<ProviderValidationResult> {
  const response = await api.post<ProviderValidationResult>(
    "/providers/validate",
    payload,
  );

  return unwrapApiResponse(response);
}

export async function upsertProviderProfile(
  workspaceId: string,
  payload: UpsertProviderProfilePayload,
): Promise<SavedProviderProfile> {
  const response = await api.post<SavedProviderProfile>(
    `/workspaces/${workspaceId}/providers`,
    payload,
  );

  return unwrapApiResponse(response);
}

export async function listProviderProfiles(
  workspaceId: string,
): Promise<SavedProviderProfile[]> {
  const response = await api.get<SavedProviderProfile[]>(
    `/workspaces/${workspaceId}/providers`,
  );

  return unwrapApiResponse(response);
}
