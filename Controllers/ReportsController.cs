using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AssistanceManagementSystem.Services;
using AssistanceManagementSystem.Data;
using Microsoft.EntityFrameworkCore;

namespace AssistanceManagementSystem.Controllers
{
    [Authorize(Roles = "Admin,BranchManager")]
    public class ReportsController : Controller
    {
        private readonly IReportService _reportService;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ReportsController> _logger;

        public ReportsController(
            IReportService reportService,
            ApplicationDbContext context,
            ILogger<ReportsController> logger)
        {
            _reportService = reportService;
            _context = context;
            _logger = logger;
        }

        // GET: Reports
        public async Task<IActionResult> Index()
        {
            try
            {
                var statistics = await _reportService.GetDashboardStatisticsAsync();
                var branches = await _context.Branches.ToListAsync();
                
                ViewBag.Statistics = statistics;
                ViewBag.Branches = branches;
                
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading reports page");
                return View();
            }
        }

        // GET: Reports/Assistances
        public async Task<IActionResult> Assistances(string? type, string? status, DateTime? fromDate, DateTime? toDate, int? branchId)
        {
            try
            {
                var assistances = await _reportService.GetFilteredAssistancesAsync(type, status, fromDate, toDate, branchId);
                var branches = await _context.Branches.ToListAsync();

                ViewBag.Type = type;
                ViewBag.Status = status;
                ViewBag.FromDate = fromDate;
                ViewBag.ToDate = toDate;
                ViewBag.BranchId = branchId;
                ViewBag.Branches = branches;

                return View(assistances);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading assistances report");
                return View(new List<Models.Assistance>());
            }
        }

        // GET: Reports/Beneficiaries
        public async Task<IActionResult> Beneficiaries(string? gender, int? branchId, string? maritalStatus)
        {
            try
            {
                var query = _context.Beneficiaries
                    .Include(b => b.Branch)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(gender))
                {
                    query = query.Where(b => b.Gender == gender);
                }

                if (branchId.HasValue)
                {
                    query = query.Where(b => b.BranchId == branchId.Value);
                }

                if (!string.IsNullOrEmpty(maritalStatus))
                {
                    query = query.Where(b => b.MaritalStatus == maritalStatus);
                }

                var beneficiaries = await query.OrderByDescending(b => b.CreatedAt).ToListAsync();
                var branches = await _context.Branches.ToListAsync();

                ViewBag.Gender = gender;
                ViewBag.BranchId = branchId;
                ViewBag.MaritalStatus = maritalStatus;
                ViewBag.Branches = branches;

                return View(beneficiaries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading beneficiaries report");
                return View(new List<Models.Beneficiary>());
            }
        }

        // GET: Reports/Financial
        public async Task<IActionResult> Financial(DateTime? fromDate, DateTime? toDate, int? branchId)
        {
            try
            {
                var query = _context.Assistances
                    .Include(a => a.Beneficiary)
                    .ThenInclude(b => b.Branch)
                    .AsQueryable();

                if (fromDate.HasValue)
                {
                    query = query.Where(a => a.Date >= fromDate.Value);
                }

                if (toDate.HasValue)
                {
                    query = query.Where(a => a.Date <= toDate.Value);
                }

                if (branchId.HasValue)
                {
                    query = query.Where(a => a.Beneficiary.BranchId == branchId.Value);
                }

                var assistances = await query.OrderByDescending(a => a.Date).ToListAsync();
                var branches = await _context.Branches.ToListAsync();

                // Calculate financial statistics
                var totalAmount = assistances.Sum(a => a.Amount);
                var paidAmount = assistances.Where(a => a.Status == "مدفوع").Sum(a => a.Amount);
                var pendingAmount = assistances.Where(a => a.Status == "معلق").Sum(a => a.Amount);
                var approvedAmount = assistances.Where(a => a.Status == "معتمد").Sum(a => a.Amount);

                var financialStats = new
                {
                    TotalAmount = totalAmount,
                    PaidAmount = paidAmount,
                    PendingAmount = pendingAmount,
                    ApprovedAmount = approvedAmount,
                    Assistances = assistances
                };

                ViewBag.FromDate = fromDate;
                ViewBag.ToDate = toDate;
                ViewBag.BranchId = branchId;
                ViewBag.Branches = branches;
                ViewBag.FinancialStats = financialStats;

                return View(assistances);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading financial report");
                return View(new List<Models.Assistance>());
            }
        }

        // POST: Reports/ExportAssistances
        [HttpPost]
        public async Task<IActionResult> ExportAssistances(string format, string? type, string? status, DateTime? fromDate, DateTime? toDate, int? branchId)
        {
            try
            {
                var assistances = await _reportService.GetFilteredAssistancesAsync(type, status, fromDate, toDate, branchId);
                
                if (format.ToLower() == "excel")
                {
                    var excelData = await _reportService.GenerateExcelReportAsync(assistances, "تقرير المساعدات");
                    return File(excelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "assistances_report.xlsx");
                }
                else if (format.ToLower() == "pdf")
                {
                    var pdfData = await _reportService.GeneratePdfReportAsync(assistances, "تقرير المساعدات");
                    return File(pdfData, "application/pdf", "assistances_report.pdf");
                }

                return BadRequest("تنسيق التصدير غير مدعوم");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting assistances report");
                TempData["ErrorMessage"] = "حدث خطأ أثناء تصدير التقرير";
                return RedirectToAction(nameof(Assistances));
            }
        }

        // POST: Reports/ExportBeneficiaries
        [HttpPost]
        public async Task<IActionResult> ExportBeneficiaries(string format, string? gender, int? branchId, string? maritalStatus)
        {
            try
            {
                var query = _context.Beneficiaries
                    .Include(b => b.Branch)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(gender))
                {
                    query = query.Where(b => b.Gender == gender);
                }

                if (branchId.HasValue)
                {
                    query = query.Where(b => b.BranchId == branchId.Value);
                }

                if (!string.IsNullOrEmpty(maritalStatus))
                {
                    query = query.Where(b => b.MaritalStatus == maritalStatus);
                }

                var beneficiaries = await query.OrderByDescending(b => b.CreatedAt).ToListAsync();

                if (format.ToLower() == "excel")
                {
                    var excelData = await _reportService.GenerateExcelReportAsync(beneficiaries.Select(b => new Models.Assistance
                    {
                        Id = b.Id,
                        Beneficiary = b,
                        Type = "تقرير المستفيدين",
                        Amount = b.Income,
                        Status = "مكتمل",
                        Date = b.CreatedAt,
                        Notes = $"النوع: {b.Gender}, الحالة الاجتماعية: {b.MaritalStatus}"
                    }).ToList(), "تقرير المستفيدين");
                    
                    return File(excelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "beneficiaries_report.xlsx");
                }
                else if (format.ToLower() == "pdf")
                {
                    var pdfData = await _reportService.GeneratePdfReportAsync(beneficiaries.Select(b => new Models.Assistance
                    {
                        Id = b.Id,
                        Beneficiary = b,
                        Type = "تقرير المستفيدين",
                        Amount = b.Income,
                        Status = "مكتمل",
                        Date = b.CreatedAt,
                        Notes = $"النوع: {b.Gender}, الحالة الاجتماعية: {b.MaritalStatus}"
                    }).ToList(), "تقرير المستفيدين");
                    
                    return File(pdfData, "application/pdf", "beneficiaries_report.pdf");
                }

                return BadRequest("تنسيق التصدير غير مدعوم");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting beneficiaries report");
                TempData["ErrorMessage"] = "حدث خطأ أثناء تصدير التقرير";
                return RedirectToAction(nameof(Beneficiaries));
            }
        }
    }
}
