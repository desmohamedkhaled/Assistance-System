using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using AssistanceManagementSystem.Data;
using AssistanceManagementSystem.Models;
using AssistanceManagementSystem.Services;

namespace AssistanceManagementSystem.Controllers
{
    [Authorize]
    public class AssistancesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IReportService _reportService;
        private readonly ILogger<AssistancesController> _logger;

        public AssistancesController(
            ApplicationDbContext context, 
            UserManager<ApplicationUser> userManager,
            IReportService reportService,
            ILogger<AssistancesController> logger)
        {
            _context = context;
            _userManager = userManager;
            _reportService = reportService;
            _logger = logger;
        }

        // GET: Assistances
        [Authorize(Roles = "Admin,BranchManager,Staff")]
        public async Task<IActionResult> Index(string? search, string? type, string? status, int? branchId, int page = 1, int pageSize = 10)
        {
            var query = _context.Assistances
                .Include(a => a.Beneficiary)
                .Include(a => a.CreatedByUser)
                .Include(a => a.ApprovedByUser)
                .Include(a => a.PaidByUser)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(a => a.Beneficiary.FullName.Contains(search) || 
                                       a.Beneficiary.NationalId.Contains(search) ||
                                       a.Notes.Contains(search));
            }

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(a => a.Type == type);
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(a => a.Status == status);
            }

            if (branchId.HasValue)
            {
                query = query.Where(a => a.Beneficiary.BranchId == branchId.Value);
            }

            // Apply role-based filtering
            if (User.IsInRole("BranchManager") || User.IsInRole("Staff"))
            {
                var userBranchId = GetCurrentUserBranchId();
                if (userBranchId.HasValue)
                {
                    query = query.Where(a => a.Beneficiary.BranchId == userBranchId.Value);
                }
            }

            var totalCount = await query.CountAsync();
            var assistances = await query
                .OrderByDescending(a => a.Date)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var branches = await _context.Branches.ToListAsync();
            var beneficiaries = await _context.Beneficiaries.ToListAsync();

            ViewBag.Search = search;
            ViewBag.Type = type;
            ViewBag.Status = status;
            ViewBag.BranchId = branchId;
            ViewBag.Branches = branches;
            ViewBag.Beneficiaries = beneficiaries;
            ViewBag.TotalCount = totalCount;
            ViewBag.Page = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            return View(assistances);
        }

        // GET: Assistances/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var assistance = await _context.Assistances
                .Include(a => a.Beneficiary)
                .Include(a => a.CreatedByUser)
                .Include(a => a.ApprovedByUser)
                .Include(a => a.PaidByUser)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (assistance == null)
            {
                return NotFound();
            }

            // Check if user has access to this assistance
            if (!CanAccessAssistance(assistance))
            {
                return Forbid();
            }

            return View(assistance);
        }

        // GET: Assistances/RequestAssistance
        [Authorize(Roles = "Staff,Beneficiary")]
        public async Task<IActionResult> RequestAssistance()
        {
            var beneficiaries = await GetAccessibleBeneficiariesAsync();
            ViewBag.Beneficiaries = beneficiaries;
            return View();
        }

        // POST: Assistances/RequestAssistance
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Staff,Beneficiary")]
        public async Task<IActionResult> RequestAssistance([Bind("BeneficiaryId,Type,Amount,PaymentMethod,Notes")] Assistance assistance)
        {
            if (ModelState.IsValid)
            {
                var currentUser = await _userManager.GetUserAsync(User);
                if (currentUser == null)
                {
                    return Unauthorized();
                }

                // Check if user has access to the beneficiary
                var beneficiary = await _context.Beneficiaries.FindAsync(assistance.BeneficiaryId);
                if (beneficiary == null || !CanAccessBeneficiary(beneficiary))
                {
                    return Forbid();
                }

                assistance.CreatedByUserId = currentUser.Id;
                assistance.Date = DateTime.UtcNow;
                assistance.Status = "معلق";
                assistance.CreatedAt = DateTime.UtcNow;

                _context.Add(assistance);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "تم إرسال طلب المساعدة بنجاح";
                return RedirectToAction(nameof(Index));
            }

            var beneficiaries = await GetAccessibleBeneficiariesAsync();
            ViewBag.Beneficiaries = beneficiaries;
            return View(assistance);
        }

        // GET: Assistances/MyRequests
        [Authorize(Roles = "Beneficiary")]
        public async Task<IActionResult> MyRequests()
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            // Find beneficiary by user ID or create a relationship
            var assistances = await _context.Assistances
                .Include(a => a.Beneficiary)
                .Include(a => a.CreatedByUser)
                .Include(a => a.ApprovedByUser)
                .Include(a => a.PaidByUser)
                .Where(a => a.CreatedByUserId == currentUser.Id)
                .OrderByDescending(a => a.Date)
                .ToListAsync();

            return View(assistances);
        }

        // GET: Assistances/Edit/5
        [Authorize(Roles = "Admin,BranchManager,Staff")]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var assistance = await _context.Assistances
                .Include(a => a.Beneficiary)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assistance == null)
            {
                return NotFound();
            }

            // Check if user has access to this assistance
            if (!CanAccessAssistance(assistance))
            {
                return Forbid();
            }

            var beneficiaries = await GetAccessibleBeneficiariesAsync();
            ViewBag.Beneficiaries = beneficiaries;
            return View(assistance);
        }

        // POST: Assistances/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin,BranchManager,Staff")]
        public async Task<IActionResult> Edit(int id, [Bind("Id,BeneficiaryId,Type,Amount,PaymentMethod,Status,Notes")] Assistance assistance)
        {
            if (id != assistance.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var existingAssistance = await _context.Assistances.FindAsync(id);
                    if (existingAssistance == null)
                    {
                        return NotFound();
                    }

                    // Check if user has access to this assistance
                    if (!CanAccessAssistance(existingAssistance))
                    {
                        return Forbid();
                    }

                    // Check if user has access to the beneficiary
                    var beneficiary = await _context.Beneficiaries.FindAsync(assistance.BeneficiaryId);
                    if (beneficiary == null || !CanAccessBeneficiary(beneficiary))
                    {
                        return Forbid();
                    }

                    // Update fields
                    existingAssistance.BeneficiaryId = assistance.BeneficiaryId;
                    existingAssistance.Type = assistance.Type;
                    existingAssistance.Amount = assistance.Amount;
                    existingAssistance.PaymentMethod = assistance.PaymentMethod;
                    existingAssistance.Status = assistance.Status;
                    existingAssistance.Notes = assistance.Notes;

                    _context.Update(existingAssistance);
                    await _context.SaveChangesAsync();
                    TempData["SuccessMessage"] = "تم تحديث بيانات المساعدة بنجاح";
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AssistanceExists(assistance.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }

            var beneficiaries = await GetAccessibleBeneficiariesAsync();
            ViewBag.Beneficiaries = beneficiaries;
            return View(assistance);
        }

        // POST: Assistances/Approve/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin,Approver")]
        public async Task<IActionResult> Approve(int id)
        {
            var assistance = await _context.Assistances.FindAsync(id);
            if (assistance == null)
            {
                return NotFound();
            }

            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            assistance.Status = "معتمد";
            assistance.ApprovedByUserId = currentUser.Id;
            assistance.ApprovedAt = DateTime.UtcNow;

            _context.Update(assistance);
            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = "تم اعتماد المساعدة بنجاح";

            return RedirectToAction(nameof(Index));
        }

        // POST: Assistances/Reject/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin,Approver")]
        public async Task<IActionResult> Reject(int id)
        {
            var assistance = await _context.Assistances.FindAsync(id);
            if (assistance == null)
            {
                return NotFound();
            }

            assistance.Status = "مرفوض";
            _context.Update(assistance);
            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = "تم رفض المساعدة";

            return RedirectToAction(nameof(Index));
        }

        // POST: Assistances/MarkPaid/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin,Approver")]
        public async Task<IActionResult> MarkPaid(int id)
        {
            var assistance = await _context.Assistances.FindAsync(id);
            if (assistance == null)
            {
                return NotFound();
            }

            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            assistance.Status = "مدفوع";
            assistance.PaidByUserId = currentUser.Id;
            assistance.PaidAt = DateTime.UtcNow;

            _context.Update(assistance);
            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = "تم تسجيل دفع المساعدة بنجاح";

            return RedirectToAction(nameof(Index));
        }

        // GET: Assistances/ExportExcel
        [Authorize(Roles = "Admin,BranchManager")]
        public async Task<IActionResult> ExportExcel(string? type, string? status, DateTime? fromDate, DateTime? toDate, int? branchId)
        {
            var assistances = await _reportService.GetFilteredAssistancesAsync(type, status, fromDate, toDate, branchId);
            var excelData = await _reportService.GenerateExcelReportAsync(assistances, "تقرير المساعدات");
            
            return File(excelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "assistances_report.xlsx");
        }

        // GET: Assistances/ExportPDF
        [Authorize(Roles = "Admin,BranchManager")]
        public async Task<IActionResult> ExportPDF(string? type, string? status, DateTime? fromDate, DateTime? toDate, int? branchId)
        {
            var assistances = await _reportService.GetFilteredAssistancesAsync(type, status, fromDate, toDate, branchId);
            var pdfData = await _reportService.GeneratePdfReportAsync(assistances, "تقرير المساعدات");
            
            return File(pdfData, "application/pdf", "assistances_report.pdf");
        }

        private bool AssistanceExists(int id)
        {
            return _context.Assistances.Any(e => e.Id == id);
        }

        private bool CanAccessAssistance(Assistance assistance)
        {
            if (User.IsInRole("Admin"))
                return true;

            if (User.IsInRole("BranchManager") || User.IsInRole("Staff"))
            {
                var userBranchId = GetCurrentUserBranchId();
                return userBranchId.HasValue && assistance.Beneficiary.BranchId == userBranchId.Value;
            }

            if (User.IsInRole("Beneficiary"))
            {
                var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                return assistance.CreatedByUserId == currentUserId;
            }

            return false;
        }

        private bool CanAccessBeneficiary(Beneficiary beneficiary)
        {
            if (User.IsInRole("Admin"))
                return true;

            if (User.IsInRole("BranchManager") || User.IsInRole("Staff"))
            {
                var userBranchId = GetCurrentUserBranchId();
                return userBranchId.HasValue && beneficiary.BranchId == userBranchId.Value;
            }

            return false;
        }

        private int? GetCurrentUserBranchId()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                var user = _context.Users.Find(userId);
                return user?.BranchId;
            }
            return null;
        }

        private async Task<List<Beneficiary>> GetAccessibleBeneficiariesAsync()
        {
            if (User.IsInRole("Admin"))
            {
                return await _context.Beneficiaries.Include(b => b.Branch).ToListAsync();
            }

            if (User.IsInRole("BranchManager") || User.IsInRole("Staff"))
            {
                var userBranchId = GetCurrentUserBranchId();
                if (userBranchId.HasValue)
                {
                    return await _context.Beneficiaries
                        .Include(b => b.Branch)
                        .Where(b => b.BranchId == userBranchId.Value)
                        .ToListAsync();
                }
            }

            return new List<Beneficiary>();
        }
    }
}
