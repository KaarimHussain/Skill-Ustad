using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;

namespace SkillUstad.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class CloudinaryController : ControllerBase
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryController(IConfiguration configuration)
        {
            var acc = new Account(
                configuration["Cloudinary:CloudName"],
                configuration["Cloudinary:ApiKey"],
                configuration["Cloudinary:ApiSecret"]
            );
            _cloudinary = new Cloudinary(acc);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            using var stream = file.OpenReadStream();
            
            try
            {
                // Create a raw upload request for documents
                var uploadParams = new RawUploadParams()
                {
                    File = new FileDescription(file.FileName, stream)
                };

                // Upload the file as a raw resource
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                
                return Ok(new { Url = uploadResult.SecureUrl.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Upload failed: {ex.Message}");
            }
        }
    }
}