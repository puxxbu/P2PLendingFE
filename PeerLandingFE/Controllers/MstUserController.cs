using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers
{
    public class MstUserController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
