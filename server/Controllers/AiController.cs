using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace SkillUstad.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        public async Task<string> AskLlamaAsync(string prompt)
        {
            Console.WriteLine("User Prompt: " + prompt);
            using var client = new HttpClient();

            var payload = new
            {
                prompt,
                max_tokens = 1000,
                temperature = 1,
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync("http://127.0.0.1:1234/v1/completions", content);
            var result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
            using var doc = JsonDocument.Parse(result);
            var answer = doc.RootElement.GetProperty("choices")[0].GetProperty("text").GetString();

            return answer ?? "Ai failed to answer";
        }

        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] string prompt)
        {
            var result = await AskLlamaAsync(prompt);
            return Ok(result);
        }

        [HttpPost("ask/stream")]
        public async Task AskStream([FromBody] string prompt)
        {
            var requestBody = new
            {
                prompt,
                max_tokens = 200,
                temperature = 0.7,
                stream = true
            };
            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Set proper SSE headers
            Response.ContentType = "text/event-stream";
            Response.Headers.Append("Cache-Control", "no-cache");
            Response.Headers.Append("Connection", "keep-alive");

            using var client = new HttpClient();
            var response = await client.PostAsync("http://127.0.0.1:1234/v1/completions", content, HttpContext.RequestAborted);

            using var stream = await response.Content.ReadAsStreamAsync();
            using var reader = new StreamReader(stream);

            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                if (!string.IsNullOrWhiteSpace(line))
                {
                    // If the line starts with "data:", extract the content
                    if (line.StartsWith("data:"))
                    {
                        var text = line.Substring("data:".Length).Trim();

                        // Check for the end of the stream
                        if (text == "[DONE]")
                        {
                            await Response.WriteAsync("data: [DONE]\n\n");
                            await Response.Body.FlushAsync();
                            break;
                        }

                        // Forward the SSE formatted message to the client
                        await Response.WriteAsync($"data: {text}\n\n");
                        await Response.Body.FlushAsync();
                    }
                }
            }
        }
    }
}