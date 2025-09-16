using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AssistanceManagementSystem.Data;
using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.Controllers
{
    [Authorize(Roles = "Admin,BranchManager,Staff")]
    public class BeneficiariesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BeneficiariesController> _logger;

        public BeneficiariesController(ApplicationDbContext context, ILogger<BeneficiariesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: Beneficiaries
        public async Task<IActionResult> Index(string? search, string? gender, int? branchId, int page = 1, int pageSize = 10)
        {
            var query = _context.Beneficiaries
                .Include(b => b.Branch)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(b => b.FullName.Contains(search) || 
                                       b.NationalId.Contains(search) || 
                                       b.Phone.Contains(search));
            }

            if (!string.IsNullOrEmpty(gender))
            {
                query = query.Where(b => b.Gender == gender);
            }

            if (branchId.HasValue)
            {
                query = query.Where(b => b.BranchId == branchId.Value);
            }

            // Apply role-based filtering
            if (User.IsInRole("BranchManager") || User.IsInRole("Staff"))
            {
                var userBranchId = GetCurrentUserBranchId();
                if (userBranchId.HasValue)
                {
                    query = query.Where(b => b.BranchId == userBranchId.Value);
                }
            }

            var totalCount = await query.CountAsync();
            var beneficiaries = await query
                .OrderByDescending(b => b.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var branches = await _context.Branches.ToListAsync();

            ViewBag.Search = search;
            ViewBag.Gender = gender;
            ViewBag.BranchId = branchId;
            ViewBag.Branches = branches;
            ViewBag.TotalCount = totalCount;
            ViewBag.Page = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            return View(beneficiaries);
        }

        // GET: Beneficiaries/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var beneficiary = await _context.Beneficiaries
                .Include(b => b.Branch)
                .Include(b => b.Assistances)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (beneficiary == null)
            {
                return NotFound();
            }

            // Check if user has access to this beneficiary
            if (!CanAccessBeneficiary(beneficiary))
            {
                return Forbid();
            }

            return View(beneficiary);
        }

        // GET: Beneficiaries/Create
        public async Task<IActionResult> Create()
        {
            var branches = await GetAccessibleBranchesAsync();
            ViewBag.Branches = branches;
            return View();
        }

        // POST: Beneficiaries/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("FullName,FirstName,SecondName,ThirdName,LastName,NationalId,Phone,Address,Gender,Religion,MaritalStatus,FamilyMembers,Income,BranchId")] Beneficiary beneficiary)
        {
            if (ModelState.IsValid)
            {
                // Check if NationalId already exists
                if (await _context.Beneficiaries.AnyAsync(b => b.NationalId == beneficiary.NationalId))
                {
                    ModelState.AddModelError("NationalId", "الرقم القومي مسجل مسبقاً");
                    var branches = await GetAccessibleBranchesAsync();
                    ViewBag.Branches = branches;
                    return View(beneficiary);
                }

                // Set default values
                beneficiary.CreatedAt = DateTime.UtcNow;
                beneficiary.FullName = $"{beneficiary.FirstName} {beneficiary.SecondName} {beneficiary.ThirdName} {beneficiary.LastName}";

                // Validate branch access
                if (!await CanAccessBranchAsync(beneficiary.BranchId))
                {
                    return Forbid();
                }

                _context.Add(beneficiary);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "تم إضافة المستفيد بنجاح";
                return RedirectToAction(nameof(Index));
            }

            var accessibleBranches = await GetAccessibleBranchesAsync();
            ViewBag.Branches = accessibleBranches;
            return View(beneficiary);
        }

        // GET: Beneficiaries/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var beneficiary = await _context.Beneficiaries.FindAsync(id);
            if (beneficiary == null)
            {
                return NotFound();
            }

            // Check if user has access to this beneficiary
            if (!CanAccessBeneficiary(beneficiary))
            {
                return Forbid();
            }

            var branches = await GetAccessibleBranchesAsync();
            ViewBag.Branches = branches;
            return View(beneficiary);
        }

        // POST: Beneficiaries/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,FullName,FirstName,SecondName,ThirdName,LastName,NationalId,Phone,Address,Gender,Religion,MaritalStatus,FamilyMembers,Income,BranchId,CreatedAt")] Beneficiary beneficiary)
        {
            if (id != beneficiary.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    // Check if NationalId already exists for another beneficiary
                    if (await _context.Beneficiaries.AnyAsync(b => b.NationalId == beneficiary.NationalId && b.Id != beneficiary.Id))
                    {
                        ModelState.AddModelError("NationalId", "الرقم القومي مسجل مسبقاً");
                        var branches = await GetAccessibleBranchesAsync();
                        ViewBag.Branches = branches;
                        return View(beneficiary);
                    }

                    // Check if user has access to this beneficiary
                    if (!CanAccessBeneficiary(beneficiary))
                    {
                        return Forbid();
                    }

                    // Validate branch access
                    if (!await CanAccessBranchAsync(beneficiary.BranchId))
                    {
                        return Forbid();
                    }

                    // Update full name
                    beneficiary.FullName = $"{beneficiary.FirstName} {beneficiary.SecondName} {beneficiary.ThirdName} {beneficiary.LastName}";

                    _context.Update(beneficiary);
                    await _context.SaveChangesAsync();
                    TempData["SuccessMessage"] = "تم تحديث بيانات المستفيد بنجاح";
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BeneficiaryExists(beneficiary.Id))
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

            var accessibleBranches = await GetAccessibleBranchesAsync();
            ViewBag.Branches = accessibleBranches;
            return View(beneficiary);
        }

        // GET: Beneficiaries/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var beneficiary = await _context.Beneficiaries
                .Include(b => b.Branch)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (beneficiary == null)
            {
                return NotFound();
            }

            // Check if user has access to this beneficiary
            if (!CanAccessBeneficiary(beneficiary))
            {
                return Forbid();
            }

            return View(beneficiary);
        }

        // POST: Beneficiaries/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var beneficiary = await _context.Beneficiaries.FindAsync(id);
            if (beneficiary != null)
            {
                // Check if user has access to this beneficiary
                if (!CanAccessBeneficiary(beneficiary))
                {
                    return Forbid();
                }

                // Check if beneficiary has assistances
                var hasAssistances = await _context.Assistances.AnyAsync(a => a.BeneficiaryId == id);
                if (hasAssistances)
                {
                    TempData["ErrorMessage"] = "لا يمكن حذف المستفيد لأنه لديه مساعدات مسجلة";
                    return RedirectToAction(nameof(Index));
                }

                _context.Beneficiaries.Remove(beneficiary);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "تم حذف المستفيد بنجاح";
            }

            return RedirectToAction(nameof(Index));
        }

        private bool BeneficiaryExists(int id)
        {
            return _context.Beneficiaries.Any(e => e.Id == id);
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

        private async Task<List<Branch>> GetAccessibleBranchesAsync()
        {
            if (User.IsInRole("Admin"))
            {
                return await _context.Branches.ToListAsync();
            }

            if (User.IsInRole("BranchManager") || User.IsInRole("Staff"))
            {
                var userBranchId = GetCurrentUserBranchId();
                if (userBranchId.HasValue)
                {
                    return await _context.Branches.Where(b => b.Id == userBranchId.Value).ToListAsync();
                }
            }

            return new List<Branch>();
        }

        private async Task<bool> CanAccessBranchAsync(int? branchId)
        {
            if (User.IsInRole("Admin"))
                return true;

            if (User.IsInRole("BranchManager") || User.IsInRole("Staff"))
            {
                var userBranchId = GetCurrentUserBranchId();
                return userBranchId.HasValue && branchId == userBranchId.Value;
            }

            return false;
        }
    }
}
