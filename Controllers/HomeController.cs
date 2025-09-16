using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AssistanceManagementSystem.Services;
using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly IReportService _reportService;
        private readonly ILogger<HomeController> _logger;

        public HomeController(IReportService reportService, ILogger<HomeController> logger)
        {
            _reportService = reportService;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var statistics = await _reportService.GetDashboardStatisticsAsync();
                return View(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading dashboard statistics");
                return View(new DashboardStatistics());
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new Models.ErrorViewModel { RequestId = System.Diagnostics.Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }

}
