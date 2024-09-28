using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.Models;

namespace PeerLandingFE.Controllers
{
    public class LenderController : Controller
    {
        private readonly ILogger<LenderController> _logger;

        public LenderController(ILogger<LenderController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
