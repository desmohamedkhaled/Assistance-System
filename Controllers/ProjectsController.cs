using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AssistanceManagementSystem.Data;
using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.Controllers
{
    [Authorize(Roles = "Admin,BranchManager")]
    public class ProjectsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProjectsController> _logger;

        public ProjectsController(ApplicationDbContext context, ILogger<ProjectsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: Projects
        public async Task<IActionResult> Index(string? search, string? type, string? status, int? organizationId, int page = 1, int pageSize = 10)
        {
            var query = _context.Projects
                .Include(p => p.Organization)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search) || 
                                       p.Description.Contains(search));
            }

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(p => p.Type == type);
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(p => p.Status == status);
            }

            if (organizationId.HasValue)
            {
                query = query.Where(p => p.OrganizationId == organizationId.Value);
            }

            var totalCount = await query.CountAsync();
            var projects = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var organizations = await _context.Organizations.ToListAsync();

            ViewBag.Search = search;
            ViewBag.Type = type;
            ViewBag.Status = status;
            ViewBag.OrganizationId = organizationId;
            ViewBag.Organizations = organizations;
            ViewBag.TotalCount = totalCount;
            ViewBag.Page = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            return View(projects);
        }

        // GET: Projects/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var project = await _context.Projects
                .Include(p => p.Organization)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (project == null)
            {
                return NotFound();
            }

            return View(project);
        }

        // GET: Projects/Create
        public async Task<IActionResult> Create()
        {
            var organizations = await _context.Organizations.ToListAsync();
            ViewBag.Organizations = organizations;
            return View();
        }

        // POST: Projects/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Name,Type,Address,Phone,Status,StartDate,EndDate,Description,OrganizationId,Budget")] Project project)
        {
            if (ModelState.IsValid)
            {
                project.CreatedAt = DateTime.UtcNow;
                _context.Add(project);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "تم إضافة المشروع بنجاح";
                return RedirectToAction(nameof(Index));
            }

            var organizations = await _context.Organizations.ToListAsync();
            ViewBag.Organizations = organizations;
            return View(project);
        }

        // GET: Projects/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            var organizations = await _context.Organizations.ToListAsync();
            ViewBag.Organizations = organizations;
            return View(project);
        }

        // POST: Projects/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Type,Address,Phone,Status,StartDate,EndDate,Description,OrganizationId,Budget,CreatedAt")] Project project)
        {
            if (id != project.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(project);
                    await _context.SaveChangesAsync();
                    TempData["SuccessMessage"] = "تم تحديث بيانات المشروع بنجاح";
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProjectExists(project.Id))
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

            var organizations = await _context.Organizations.ToListAsync();
            ViewBag.Organizations = organizations;
            return View(project);
        }

        // GET: Projects/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var project = await _context.Projects
                .Include(p => p.Organization)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (project == null)
            {
                return NotFound();
            }

            return View(project);
        }

        // POST: Projects/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project != null)
            {
                _context.Projects.Remove(project);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "تم حذف المشروع بنجاح";
            }

            return RedirectToAction(nameof(Index));
        }

        private bool ProjectExists(int id)
        {
            return _context.Projects.Any(e => e.Id == id);
        }
    }
}
