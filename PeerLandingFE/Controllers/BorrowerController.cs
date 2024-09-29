using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers
{
    public class BorrowerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult UserData()
        {
            // Ambil data peminjam dari model/database

            // Kirim data peminjam ke view
            return View();
        }

        public IActionResult HistoryLoan()
        {
            // Ambil data peminjam dari model/database

            // Kirim data peminjam ke view
            return View();
        }

    }
}
