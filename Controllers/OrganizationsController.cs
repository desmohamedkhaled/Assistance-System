using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AssistanceManagementSystem.Data;
using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.Controllers
{
    [Authorize(Roles = "Admin,BranchManager")]
    public class OrganizationsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<OrganizationsController> _logger;

        public OrganizationsController(ApplicationDbContext context, ILogger<OrganizationsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: Organizations
        public async Task<IActionResult> Index(string? search, string? type, int page = 1, int pageSize = 10)
        {
            var query = _context.Organizations.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(o => o.Name.Contains(search) || 
                                       o.ContactPerson.Contains(search) ||
                                       o.Email.Contains(search));
            }

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(o => o.Type == type);
            }

            var totalCount = await query.CountAsync();
            var organizations = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            ViewBag.Search = search;
            ViewBag.Type = type;
            ViewBag.TotalCount = totalCount;
            ViewBag.Page = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            return View(organizations);
        }

        // GET: Organizations/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var organization = await _context.Organizations
                .Include(o => o.Projects)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (organization == null)
            {
                return NotFound();
            }

            return View(organization);
        }

        // GET: Organizations/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Organizations/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Name,Type,Address,Phone,AccountNumber,ContactPerson,Email")] Organization organization)
        {
            if (ModelState.IsValid)
            {
                organization.CreatedAt = DateTime.UtcNow;
                _context.Add(organization);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "تم إضافة المؤسسة بنجاح";
                return RedirectToAction(nameof(Index));
            }
            return View(organization);
        }

        // GET: Organizations/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var organization = await _context.Organizations.FindAsync(id);
            if (organization == null)
            {
                return NotFound();
            }
            return View(organization);
        }

        // POST: Organizations/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Type,Address,Phone,AccountNumber,ContactPerson,Email,CreatedAt")] Organization organization)
        {
            if (id != organization.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(organization);
                    await _context.SaveChangesAsync();
                    TempData["SuccessMessage"] = "تم تحديث بيانات المؤسسة بنجاح";
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!OrganizationExists(organization.Id))
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
            return View(organization);
        }

        // GET: Organizations/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var organization = await _context.Organizations
                .FirstOrDefaultAsync(m => m.Id == id);

            if (organization == null)
            {
                return NotFound();
            }

            return View(organization);
        }

        // POST: Organizations/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var organization = await _context.Organizations.FindAsync(id);
            if (organization != null)
            {
                // Check if organization has projects
                var hasProjects = await _context.Projects.AnyAsync(p => p.OrganizationId == id);
                if (hasProjects)
                {
                    TempData["ErrorMessage"] = "لا يمكن حذف المؤسسة لأنها لديها مشاريع مسجلة";
                    return RedirectToAction(nameof(Index));
                }

                _context.Organizations.Remove(organization);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "تم حذف المؤسسة بنجاح";
            }

            return RedirectToAction(nameof(Index));
        }

        private bool OrganizationExists(int id)
        {
            return _context.Organizations.Any(e => e.Id == id);
        }
    }
}
