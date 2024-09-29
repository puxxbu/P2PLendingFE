using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.DTO.Req;
using System.Net.Http.Headers;
using System.Net.NetworkInformation;
using System.Text;
using System.Text.Json;

namespace PeerLandingFE.Controllers.api
{
    public class ApiBorrowerController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ApiSettings _apiSettings;
        public ApiBorrowerController(HttpClient httpClient, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _httpClientFactory = httpClientFactory;
            _apiSettings = configuration.GetSection("ApiSettings").Get<ApiSettings>();
        }

        [HttpGet]
        public async Task<IActionResult> GetRequestedLoan()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);


            var response = await _httpClient.GetAsync($"{_apiSettings.BaseUrl}/loan/borrower-loan?status=requested");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to get users");
            }

        }

        [HttpGet]
        public async Task<IActionResult> GetLoanByStatus(string status)
        {
            if (string.IsNullOrEmpty(status))
            {
                return BadRequest("status is required");
            }
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);


            var response = await _httpClient.GetAsync($"{_apiSettings.BaseUrl}/loan/borrower-loan?status=" + status);

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to get users");
            }

        }

        [HttpGet]
        public async Task<IActionResult> GetAllLoan()
        {

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);


            var response = await _httpClient.GetAsync($"{_apiSettings.BaseUrl}/loan/borrower-loan");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to get users");
            }

        }

        [HttpPost]
        public async Task<IActionResult> AddLoan([FromBody] ReqAddLoanDto reqAddLoanDto)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqAddLoanDto);
            var data = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"{_apiSettings.BaseUrl}/loan", data);

            if (response.IsSuccessStatusCode)
            {
                return Ok("Loan added successfully");
            }
            else
            {
                var errorMessage = await response.Content.ReadAsStringAsync();
                return BadRequest(new { message = $"Failed to add user: {errorMessage}" });
            }
        }

    }
}
