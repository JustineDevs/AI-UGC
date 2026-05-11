# Data Model: AI-UGC Template Platform Transformation

## WorkspaceTemplate

- **Purpose**: Top-level cloned template instance with enabled providers, storage settings, and registered template modules.
- **Fields**:
  - `id` UUID
  - `name` string
  - `slug` string
  - `defaultProviderProfileId` UUID
  - `storageProfileId` UUID
  - `enabledNichePackKeys` string[]
  - `createdAt` datetime
  - `updatedAt` datetime
- **Relationships**:
  - has many `ProviderProfile`
  - has many `ProjectProfile`
  - has many `WorkflowBlueprint`
- **Validation**:
  - `slug` unique within the deployment
  - `defaultProviderProfileId` must reference an enabled provider

## ProviderProfile

- **Purpose**: Stores LaoZhang/APIMart connection details and routing preferences.
- **Fields**:
  - `id` UUID
  - `workspaceTemplateId` UUID
  - `providerKey` enum (`laozhang`, `apimart`)
  - `displayName` string
  - `baseUrl` string
  - `apiKeySecretRef` string
  - `defaultTextModel` string
  - `defaultVideoModel` string
  - `defaultImageModel` string nullable
  - `enabledCapabilities` string[]
  - `fallbackPriority` integer nullable
  - `status` enum (`draft`, `validated`, `disabled`)
  - `lastValidatedAt` datetime nullable
- **Relationships**:
  - belongs to `WorkspaceTemplate`
  - referenced by `WorkflowBlueprint`
  - referenced by `ProviderJob`
- **Validation**:
  - `baseUrl` must be HTTPS
  - one provider may be default per workspace per capability unless routing policy allows override

## CapabilityMatrixEntry

- **Purpose**: Runtime-readable capability registry per provider/model combination.
- **Fields**:
  - `id` UUID
  - `providerKey` enum
  - `capabilityType` enum (`chat`, `prompt_generation`, `image_generation`, `video_generation`, `status_polling`, `moderation`)
  - `modelKey` string
  - `supportsAsync` boolean
  - `supportsWebhook` boolean
  - `inputModes` string[]
  - `outputModes` string[]
  - `notes` string nullable
- **Relationships**:
  - referenced by `WorkflowBlueprintStep`
  - used by `ProviderRoutingPolicy`
- **Validation**:
  - unique on (`providerKey`, `capabilityType`, `modelKey`)

## NichePack

- **Purpose**: Declarative module for a specific AI-UGC use case.
- **Fields**:
  - `key` string
  - `version` string
  - `label` string
  - `description` string
  - `defaultChannelTargets` string[]
  - `requiredAssetTypes` string[]
  - `intakeSchemaRef` string
  - `promptModuleRefs` string[]
  - `outputPolicyRef` string
  - `status` enum (`active`, `deprecated`)
- **Relationships**:
  - selectable by `WorkspaceTemplate`
  - referenced by `WorkflowBlueprint`
- **Validation**:
  - `key + version` unique
  - all refs must resolve to shipped config artifacts

## WorkflowBlueprint

- **Purpose**: Versioned execution definition for one project/workspace flow.
- **Fields**:
  - `id` UUID
  - `workspaceTemplateId` UUID
  - `nichePackKey` string nullable
  - `name` string
  - `version` integer
  - `status` enum (`draft`, `active`, `archived`)
  - `providerPolicy` JSON
  - `intakeSchema` JSON
  - `stepGraph` JSON
  - `promptAssemblyConfig` JSON
  - `moderationPolicy` JSON
  - `outputPolicy` JSON
  - `createdAt` datetime
  - `updatedAt` datetime
- **Relationships**:
  - belongs to `WorkspaceTemplate`
  - optionally derived from `NichePack`
  - attached to `ProjectProfile`
  - snapshotted into `GenerationSession`
- **Validation**:
  - one active version per blueprint name per workspace
  - step graph must be acyclic

## ProjectProfile

- **Purpose**: Customer/campaign-specific reusable configuration.
- **Fields**:
  - `id` UUID
  - `workspaceTemplateId` UUID
  - `workflowBlueprintId` UUID
  - `name` string
  - `brandVoice` text
  - `audience` text
  - `offerDetails` text
  - `claimsPolicy` JSON
  - `channelTargets` string[]
  - `forbiddenTerms` string[]
  - `assetConstraints` JSON
  - `createdAt` datetime
  - `updatedAt` datetime
- **Relationships**:
  - belongs to `WorkspaceTemplate`
  - belongs to `WorkflowBlueprint`
  - has many `GenerationSession`
- **Validation**:
  - `name` unique within a workspace

## GenerationSession

- **Purpose**: One user execution of a blueprint for a specific content generation run.
- **Fields**:
  - `id` UUID
  - `projectProfileId` UUID
  - `workflowBlueprintSnapshot` JSON
  - `status` enum (`created`, `collecting_inputs`, `analyzing`, `prompting`, `generating`, `review_ready`, `failed`, `completed`)
  - `channelTarget` string
  - `campaignInputs` JSON
  - `analysisSummary` JSON nullable
  - `promptDraft` text nullable
  - `promptApprovedAt` datetime nullable
  - `providerRoutingTrace` JSON
  - `createdAt` datetime
  - `updatedAt` datetime
- **Relationships**:
  - belongs to `ProjectProfile`
  - has many `SourceAsset`
  - has many `ProviderJob`
  - has many `OutputAsset`
- **Validation**:
  - snapshot required so later blueprint edits do not mutate historical runs

## SourceAsset

- **Purpose**: User-supplied input media and documents for a session.
- **Fields**:
  - `id` UUID
  - `generationSessionId` UUID
  - `assetType` enum (`source_video`, `product_image`, `brand_guide`, `ugc_reference`, `script_reference`)
  - `storageKey` string
  - `mimeType` string
  - `fileName` string
  - `fileSizeBytes` bigint
  - `metadata` JSON
  - `createdAt` datetime
- **Relationships**:
  - belongs to `GenerationSession`
- **Validation**:
  - supported asset types depend on the blueprint or niche pack

## ProviderJob

- **Purpose**: Normalized record for work executed by LaoZhang, APIMart, Gemini, or future providers.
- **Fields**:
  - `id` UUID
  - `generationSessionId` UUID
  - `providerProfileId` UUID
  - `capabilityType` enum
  - `modelKey` string
  - `externalTaskId` string nullable
  - `requestSummary` JSON
  - `status` enum (`queued`, `running`, `succeeded`, `failed`, `cancelled`)
  - `statusHistory` JSON
  - `attemptCount` integer
  - `errorCode` string nullable
  - `errorMessage` text nullable
  - `startedAt` datetime nullable
  - `completedAt` datetime nullable
- **Relationships**:
  - belongs to `GenerationSession`
  - belongs to `ProviderProfile`
  - produces `OutputAsset`
- **Validation**:
  - `externalTaskId` required for async jobs after remote submission

## OutputAsset

- **Purpose**: Generated or derived output linked back to its provider work.
- **Fields**:
  - `id` UUID
  - `generationSessionId` UUID
  - `providerJobId` UUID nullable
  - `assetType` enum (`prompt_text`, `analysis_json`, `preview_image`, `output_video`, `transcript`, `moderation_report`)
  - `storageKey` string nullable
  - `textContent` text nullable
  - `mimeType` string nullable
  - `metadata` JSON
  - `createdAt` datetime
- **Relationships**:
  - belongs to `GenerationSession`
  - optionally belongs to `ProviderJob`
- **Validation**:
  - either `storageKey` or `textContent` must be present

## State Transitions

### GenerationSession

- `created` → `collecting_inputs`
- `collecting_inputs` → `analyzing`
- `analyzing` → `prompting`
- `prompting` → `generating`
- `generating` → `review_ready`
- any active state → `failed`
- `review_ready` → `completed`

### ProviderJob

- `queued` → `running`
- `running` → `succeeded`
- `running` → `failed`
- `queued` or `running` → `cancelled`
