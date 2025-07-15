using Microsoft.AspNetCore.Mvc;
using RestSharp;
using System.Text.Json;

namespace SkillUstad.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InterviewController : ControllerBase
    {
        private const string MurfApiKey = "ap2_6ec54bb2-8b40-49d7-bba0-c27d9b75bfb9";

        [HttpPost("murf/generate")]
        public async Task<IActionResult> GenerateAudioUrl([FromBody] string inputText)
        {
            if (string.IsNullOrWhiteSpace(inputText))
                return BadRequest("Text cannot be empty.");

            var client = new RestClient("https://api.murf.ai");
            var request = new RestRequest("/v1/speech/generate", Method.Post);
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("Accept", "application/json");
            request.AddHeader("api-key", MurfApiKey);

            var body = new
            {
                voiceId = "en-US-charles",
                style = "Conversational",
                text = inputText
            };

            request.AddJsonBody(body);

            var response = await client.ExecuteAsync(request);

            if (!response.IsSuccessful)
            {
                return StatusCode((int)response.StatusCode, $"Murf API Error: {response.Content}");
            }

            return Content(response.Content, "application/json");
        }
    }
}
