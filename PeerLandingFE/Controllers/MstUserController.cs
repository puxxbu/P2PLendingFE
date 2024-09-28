using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.Controllers.Auth;

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
