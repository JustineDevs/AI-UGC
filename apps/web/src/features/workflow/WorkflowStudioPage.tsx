import { AnalysisDisplay } from "../../components/AnalysisDisplay";
import { ImageUpload } from "../../components/ImageUpload";
import { ProductInput } from "../../components/ProductInput";
import { ProgressIndicator } from "../../components/ProgressIndicator";
import { PromptEditor } from "../../components/PromptEditor";
import { VideoPlayer } from "../../components/VideoPlayer";
import { VideoUpload } from "../../components/VideoUpload";
import { useWorkflow } from "../../hooks/useWorkflow";

export function WorkflowStudioPage() {
  const {
    currentStep,
    isInitializing,
    isUploading,
    isAnalyzing,
    analysis,
    isSubmittingProduct,
    prompt,
    isGeneratingPrompt,
    isUpdatingPrompt,
    isApprovingPrompt,
    productImagePreview,
    isUploadingImage,
    imageUploadProgress,
    generatedVideo,
    isGeneratingVideo,
    originalVideoUrl,
    error,
    uploadVideo,
    updateAnalysis,
    submitProductInfo,
    generatePrompt,
    updatePrompt,
    approvePrompt,
    selectProductImage,
    uploadProductImage,
    generateVideo: startGenerateVideo,
    clearError,
  } = useWorkflow();

  const workflowSteps = [
    "Upload Video",
    "AI Analysis",
    "Product Info",
    "Generate Prompt",
    "Generate Video",
  ];

  const getStepIndex = () => {
    switch (currentStep) {
      case "upload":
        return 0;
      case "analyzing":
        return 1;
      case "analysis-complete":
        return 1;
      case "product-input":
        return 2;
      case "prompt-generation":
        return 3;
      case "video-generation":
        return 4;
      case "complete":
        return 5;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
            <button
              onClick={clearError}
              className="ml-3 flex-shrink-0 text-red-400 hover:text-red-500"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <ProgressIndicator currentStep={getStepIndex()} steps={workflowSteps} />

      <div className="space-y-6">
        {(currentStep === "upload" || isUploading) && (
          <VideoUpload
            onUploadStart={uploadVideo}
            onUploadError={(uploadError) => console.error(uploadError)}
            isUploading={isUploading}
            isInitializing={isInitializing}
          />
        )}

        {(currentStep === "analyzing" ||
          currentStep === "analysis-complete") && (
          <AnalysisDisplay
            analysisText={analysis?.sceneBreakdown || ""}
            isAnalyzing={isAnalyzing}
            onEdit={updateAnalysis}
            onSave={() => {
              // Reserved for future blueprint-aware transitions.
            }}
          />
        )}

        {currentStep === "product-input" && (
          <ProductInput
            onSubmit={(name, description) =>
              submitProductInfo(name, description)
            }
            isSubmitting={isSubmittingProduct}
          />
        )}

        {currentStep === "prompt-generation" && (
          <div className="space-y-6">
            {!prompt && !isGeneratingPrompt && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">
                  Ready to Generate Prompt
                </h2>
                <p className="text-gray-600 mb-6">
                  Click the button below to generate a text-to-video prompt
                  based on your video analysis and product information.
                </p>
                <button
                  onClick={generatePrompt}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Generate Prompt with AI
                </button>
              </div>
            )}

            {isGeneratingPrompt && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-700">
                    Creating a prompt for video generation using AI...
                  </p>
                </div>
              </div>
            )}

            {prompt && (
              <PromptEditor
                prompt={prompt}
                onUpdate={updatePrompt}
                onApprove={approvePrompt}
                isUpdating={isUpdatingPrompt}
                isApproving={isApprovingPrompt}
              />
            )}
          </div>
        )}

        {currentStep === "video-generation" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Upload Product Image</h2>
              <p className="text-gray-600 mb-6">
                Upload an image of your product to be used as reference for the
                video generation.
              </p>
              <ImageUpload
                onImageSelect={selectProductImage}
                onUpload={uploadProductImage}
                uploadProgress={imageUploadProgress}
                previewUrl={productImagePreview}
                error={
                  error?.includes("image") || error?.includes("Image")
                    ? error
                    : undefined
                }
                disabled={isUploadingImage}
              />
            </div>

            {imageUploadProgress === 100 &&
              !isGeneratingVideo &&
              !generatedVideo && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    Ready to Generate Video
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your prompt is approved and product image is uploaded. Click
                    below to start generating your advertisement video using
                    Sora 2 AI.
                  </p>
                  <button
                    onClick={startGenerateVideo}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
                  >
                    Generate Advertisement Video
                  </button>
                </div>
              )}

            {isGeneratingVideo && generatedVideo && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">
                  Generating Your Video
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <div className="flex-1">
                      <p className="text-gray-700 font-medium">
                        Video generation in progress...
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {generatedVideo.status}
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      This may take 3-5 minutes. Please do not close this page.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === "complete" && generatedVideo?.downloadUrl && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-2 text-green-600">
                Video Generation Complete
              </h2>
              <p className="text-gray-600 mb-6">
                Your advertisement video has been successfully generated.
                Compare it with the original video below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {originalVideoUrl && (
                <VideoPlayer
                  videoUrl={originalVideoUrl}
                  title="Original UGC Video"
                  className="bg-white rounded-lg shadow p-6"
                />
              )}

              <VideoPlayer
                videoUrl={generatedVideo.downloadUrl}
                title="Generated Advertisement"
                downloadUrl={generatedVideo.downloadUrl}
                className="bg-white rounded-lg shadow p-6"
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">What&apos;s Next?</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Another Video
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
