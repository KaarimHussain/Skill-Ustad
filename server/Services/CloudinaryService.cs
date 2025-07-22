// using CloudinaryDotNet;
// using CloudinaryDotNet.Actions;
// using Microsoft.AspNetCore.Http;
// using Microsoft.Extensions.Configuration;

// /// <summary>
// /// Service for handling Cloudinary operations including upload, download, update, and delete of assets.
// /// </summary>
// public class CloudinaryService : ICloudinaryService
// {
//     private readonly Cloudinary _cloudinary;

//     /// <summary>
//     /// Initializes a new instance of the CloudinaryService.
//     /// </summary>
//     /// <param name="configuration">Application configuration to access Cloudinary settings.</param>
//     public CloudinaryService(IConfiguration configuration)
//     {
//         var account = new Account(
//             configuration["Cloudinary:CloudName"],
//             configuration["Cloudinary:ApiKey"],
//             configuration["Cloudinary:ApiSecret"]);

//         _cloudinary = new Cloudinary(account);
//     }

//     /// <summary>
//     /// Uploads a file to Cloudinary.
//     /// </summary>
//     /// <param name="file">The file to upload.</param>
//     /// <param name="publicId">Optional public ID for the asset. If not provided, Cloudinary will generate one.</param>
//     /// <param name="folder">Optional folder path to organize assets.</param>
//     /// <param name="overwrite">Whether to overwrite an existing asset with the same public ID.</param>
//     /// <returns>The upload result containing details of the uploaded asset.</returns>
//     public async Task<ImageUploadResult> UploadAsync(IFormFile file, string publicId = null, string folder = null, bool overwrite = false)
//     {
//         if (file == null || file.Length == 0)
//         {
//             throw new ArgumentException("File is empty or null");
//         }

//         await using var stream = file.OpenReadStream();
//         var uploadParams = new ImageUploadParams
//         {
//             File = new FileDescription(file.FileName, stream),
//             PublicId = publicId,
//             Folder = folder,
//             Overwrite = overwrite,
//             ResourceType = ResourceType.Auto
//         };

//         return await _cloudinary.UploadAsync(uploadParams);
//     }

//     /// <summary>
//     /// Gets the URL of an asset stored in Cloudinary.
//     /// </summary>
//     /// <param name="publicId">The public ID of the asset.</param>
//     /// <param name="transformations">Optional transformations to apply to the asset URL.</param>
//     /// <param name="resourceType">The type of resource (image, video, raw). Default is image.</param>
//     /// <returns>The URL of the asset.</returns>
//     public string GetAssetUrl(string publicId, Transformation transformations = null, string resourceType = "image")
//     {
//         if (string.IsNullOrEmpty(publicId))
//         {
//             throw new ArgumentException("Public ID cannot be null or empty");
//         }

//         return _cloudinary.Api.UrlImgUp.Transform(transformations)
//             .BuildUrl(publicId);
//     }

//     /// <summary>
//     /// Updates an existing asset in Cloudinary.
//     /// </summary>
//     /// <param name="publicId">The public ID of the asset to update.</param>
//     /// <param name="newFile">Optional new file to replace the existing asset.</param>
//     /// <param name="newPublicId">Optional new public ID for the asset.</param>
//     /// <param name="tags">Optional tags to add to the asset.</param>
//     /// <param name="context">Optional context data to add to the asset.</param>
//     /// <returns>The update result containing details of the updated asset.</returns>
//     public async Task<ImageUploadResult> UpdateAsync(string publicId, IFormFile newFile = null, string newPublicId = null,
//         string[] tags = null, string[] context = null)
//     {
//         if (string.IsNullOrEmpty(publicId))
//         {
//             throw new ArgumentException("Public ID cannot be null or empty");
//         }

//         if (newFile != null)
//         {
//             // If a new file is provided, upload it with the same public ID (overwriting)
//             await using var stream = newFile.OpenReadStream();
//             var uploadParams = new ImageUploadParams
//             {
//                 File = new FileDescription(newFile.FileName, stream),
//                 PublicId = publicId,
//                 Overwrite = true,
//                 Tags = tags != null ? string.Join(",", tags) : null,
//                 Context = context != null ? new StringDictionary(context) : null
//             };

//             return await _cloudinary.UploadAsync(uploadParams);
//         }
//         else
//         {
//             // If no new file, just update metadata
//             var updateParams = new UpdateParams(publicId)
//             {
//                 PublicId = newPublicId,
//                 Tags = tags != null ? string.Join(",", tags) : null,
//                 Context = context != null ? new StringDictionary(context) : null
//             };

//             return await _cloudinary.UpdateAsync(updateParams);
//         }
//     }

//     /// <summary>
//     /// Deletes an asset from Cloudinary.
//     /// </summary>
//     /// <param name="publicId">The public ID of the asset to delete.</param>
//     /// <param name="resourceType">The type of resource (image, video, raw). Default is image.</param>
//     /// <returns>The deletion result.</returns>
//     public async Task<DeletionResult> DeleteAsync(string publicId, string resourceType = "image")
//     {
//         if (string.IsNullOrEmpty(publicId))
//         {
//             throw new ArgumentException("Public ID cannot be null or empty");
//         }

//         var deletionParams = new DeletionParams(publicId)
//         {
//             ResourceType = resourceType
//         };

//         return await _cloudinary.DestroyAsync(deletionParams);
//     }

//     /// <summary>
//     /// Lists all assets in Cloudinary with optional filtering.
//     /// </summary>
//     /// <param name="nextCursor">Optional cursor for pagination.</param>
//     /// <param name="tags">Optional tags to filter by.</param>
//     /// <param name="prefix">Optional prefix to filter by.</param>
//     /// <param name="maxResults">Maximum number of results to return. Default is 10.</param>
//     /// <returns>A list of assets matching the criteria.</returns>
//     public async Task<ListResourcesResult> ListAssetsAsync(string nextCursor = null, string[] tags = null,
//         string prefix = null, int maxResults = 10)
//     {
//         var listParams = new ListResourcesParams
//         {
//             NextCursor = nextCursor,
//             MaxResults = maxResults,
//             Tags = tags != null && tags.Length > 0,
//             Prefix = prefix,
//             Type = "upload"
//         };

//         if (tags != null && tags.Length > 0)
//         {
//             listParams.Tags = true;
//             listParams.TagPrefix = string.Join(",", tags);
//         }

//         return await _cloudinary.ListResourcesAsync(listParams);
//     }
// }

// /// <summary>
// /// Interface for Cloudinary service operations.
// /// </summary>
// public interface ICloudinaryService
// {
//     Task<ImageUploadResult> UploadAsync(IFormFile file, string publicId = null, string folder = null, bool overwrite = false);
//     string GetAssetUrl(string publicId, Transformation transformations = null, string resourceType = "image");
//     Task<ImageUploadResult> UpdateAsync(string publicId, IFormFile newFile = null, string newPublicId = null,
//         string[] tags = null, string[] context = null);
//     Task<DeletionResult> DeleteAsync(string publicId, string resourceType = "image");
//     Task<ListResourcesResult> ListAssetsAsync(string nextCursor = null, string[] tags = null,
//         string prefix = null, int maxResults = 10);
// }