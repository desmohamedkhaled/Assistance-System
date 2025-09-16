using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using AssistanceManagementSystem.Data;
using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserManagementController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserManagementController> _logger;

        public UserManagementController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context,
            ILogger<UserManagementController> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _logger = logger;
        }

        // GET: UserManagement
        public async Task<IActionResult> Index(string? search, string? role, int? branchId, int page = 1, int pageSize = 10)
        {
            var query = _userManager.Users
                .Include(u => u.Branch)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => u.FullName.Contains(search) || 
                                       u.Email.Contains(search) ||
                                       u.UserName.Contains(search));
            }

            if (!string.IsNullOrEmpty(role))
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(role);
                var userIds = usersInRole.Select(u => u.Id);
                query = query.Where(u => userIds.Contains(u.Id));
            }

            if (branchId.HasValue)
            {
                query = query.Where(u => u.BranchId == branchId.Value);
            }

            var totalCount = await query.CountAsync();
            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Get user roles
            var usersWithRoles = new List<UserWithRoles>();
            foreach (var user in users)
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                usersWithRoles.Add(new UserWithRoles
                {
                    User = user,
                    Roles = userRoles.ToList()
                });
            }

            var branches = await _context.Branches.ToListAsync();
            var roles = await _roleManager.Roles.ToListAsync();

            ViewBag.Search = search;
            ViewBag.Role = role;
            ViewBag.BranchId = branchId;
            ViewBag.Branches = branches;
            ViewBag.Roles = roles;
            ViewBag.TotalCount = totalCount;
            ViewBag.Page = page;
            ViewBag.PageSize = pageSize;
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            return View(usersWithRoles);
        }

        // GET: UserManagement/Details/5
        public async Task<IActionResult> Details(string? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var user = await _userManager.Users
                .Include(u => u.Branch)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            var userWithRoles = new UserWithRoles
            {
                User = user,
                Roles = userRoles.ToList()
            };

            return View(userWithRoles);
        }

        // GET: UserManagement/Create
        public async Task<IActionResult> Create()
        {
            var branches = await _context.Branches.ToListAsync();
            var roles = await _roleManager.Roles.ToListAsync();
            
            ViewBag.Branches = branches;
            ViewBag.Roles = roles;
            
            return View();
        }

        // POST: UserManagement/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("UserName,Email,FullName,PhoneNumber,BranchId,IsActive")] ApplicationUser user, string password, string[] selectedRoles)
        {
            if (ModelState.IsValid)
            {
                // Check if username already exists
                if (await _userManager.FindByNameAsync(user.UserName) != null)
                {
                    ModelState.AddModelError("UserName", "اسم المستخدم مسجل مسبقاً");
                    var branches = await _context.Branches.ToListAsync();
                    var roles = await _roleManager.Roles.ToListAsync();
                    ViewBag.Branches = branches;
                    ViewBag.Roles = roles;
                    return View(user);
                }

                // Check if email already exists
                if (await _userManager.FindByEmailAsync(user.Email) != null)
                {
                    ModelState.AddModelError("Email", "البريد الإلكتروني مسجل مسبقاً");
                    var branches = await _context.Branches.ToListAsync();
                    var roles = await _roleManager.Roles.ToListAsync();
                    ViewBag.Branches = branches;
                    ViewBag.Roles = roles;
                    return View(user);
                }

                user.CreatedAt = DateTime.UtcNow;
                user.EmailConfirmed = true;

                var result = await _userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    // Add roles
                    if (selectedRoles != null && selectedRoles.Length > 0)
                    {
                        await _userManager.AddToRolesAsync(user, selectedRoles);
                    }

                    TempData["SuccessMessage"] = "تم إنشاء المستخدم بنجاح";
                    return RedirectToAction(nameof(Index));
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            var accessibleBranches = await _context.Branches.ToListAsync();
            var accessibleRoles = await _roleManager.Roles.ToListAsync();
            ViewBag.Branches = accessibleBranches;
            ViewBag.Roles = accessibleRoles;
            return View(user);
        }

        // GET: UserManagement/Edit/5
        public async Task<IActionResult> Edit(string? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var user = await _userManager.Users
                .Include(u => u.Branch)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            var branches = await _context.Branches.ToListAsync();
            var roles = await _roleManager.Roles.ToListAsync();

            ViewBag.Branches = branches;
            ViewBag.Roles = roles;
            ViewBag.UserRoles = userRoles;

            return View(user);
        }

        // POST: UserManagement/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("Id,UserName,Email,FullName,PhoneNumber,BranchId,IsActive,CreatedAt")] ApplicationUser user, string[] selectedRoles)
        {
            if (id != user.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var existingUser = await _userManager.FindByIdAsync(id);
                    if (existingUser == null)
                    {
                        return NotFound();
                    }

                    // Check if username already exists for another user
                    var userWithSameUsername = await _userManager.FindByNameAsync(user.UserName);
                    if (userWithSameUsername != null && userWithSameUsername.Id != id)
                    {
                        ModelState.AddModelError("UserName", "اسم المستخدم مسجل مسبقاً");
                        var branches = await _context.Branches.ToListAsync();
                        var roles = await _roleManager.Roles.ToListAsync();
                        var userRoles = await _userManager.GetRolesAsync(existingUser);
                        ViewBag.Branches = branches;
                        ViewBag.Roles = roles;
                        ViewBag.UserRoles = userRoles;
                        return View(user);
                    }

                    // Check if email already exists for another user
                    var userWithSameEmail = await _userManager.FindByEmailAsync(user.Email);
                    if (userWithSameEmail != null && userWithSameEmail.Id != id)
                    {
                        ModelState.AddModelError("Email", "البريد الإلكتروني مسجل مسبقاً");
                        var branches = await _context.Branches.ToListAsync();
                        var roles = await _roleManager.Roles.ToListAsync();
                        var userRoles = await _userManager.GetRolesAsync(existingUser);
                        ViewBag.Branches = branches;
                        ViewBag.Roles = roles;
                        ViewBag.UserRoles = userRoles;
                        return View(user);
                    }

                    // Update user properties
                    existingUser.UserName = user.UserName;
                    existingUser.Email = user.Email;
                    existingUser.FullName = user.FullName;
                    existingUser.PhoneNumber = user.PhoneNumber;
                    existingUser.BranchId = user.BranchId;
                    existingUser.IsActive = user.IsActive;

                    var result = await _userManager.UpdateAsync(existingUser);
                    if (result.Succeeded)
                    {
                        // Update roles
                        var currentRoles = await _userManager.GetRolesAsync(existingUser);
                        await _userManager.RemoveFromRolesAsync(existingUser, currentRoles);
                        
                        if (selectedRoles != null && selectedRoles.Length > 0)
                        {
                            await _userManager.AddToRolesAsync(existingUser, selectedRoles);
                        }

                        TempData["SuccessMessage"] = "تم تحديث بيانات المستخدم بنجاح";
                        return RedirectToAction(nameof(Index));
                    }

                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!await UserExistsAsync(user.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }

            var accessibleBranches = await _context.Branches.ToListAsync();
            var accessibleRoles = await _roleManager.Roles.ToListAsync();
            var currentUserRoles = await _userManager.GetRolesAsync(user);
            ViewBag.Branches = accessibleBranches;
            ViewBag.Roles = accessibleRoles;
            ViewBag.UserRoles = currentUserRoles;
            return View(user);
        }

        // GET: UserManagement/Delete/5
        public async Task<IActionResult> Delete(string? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var user = await _userManager.Users
                .Include(u => u.Branch)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            var userWithRoles = new UserWithRoles
            {
                User = user,
                Roles = userRoles.ToList()
            };

            return View(userWithRoles);
        }

        // POST: UserManagement/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user != null)
            {
                // Check if user is admin
                if (await _userManager.IsInRoleAsync(user, "Admin"))
                {
                    TempData["ErrorMessage"] = "لا يمكن حذف مدير النظام";
                    return RedirectToAction(nameof(Index));
                }

                // Check if user has created assistances
                var hasAssistances = await _context.Assistances.AnyAsync(a => a.CreatedByUserId == id);
                if (hasAssistances)
                {
                    TempData["ErrorMessage"] = "لا يمكن حذف المستخدم لأنه لديه مساعدات مسجلة";
                    return RedirectToAction(nameof(Index));
                }

                var result = await _userManager.DeleteAsync(user);
                if (result.Succeeded)
                {
                    TempData["SuccessMessage"] = "تم حذف المستخدم بنجاح";
                }
                else
                {
                    TempData["ErrorMessage"] = "حدث خطأ أثناء حذف المستخدم";
                }
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: UserManagement/ResetPassword/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(string id, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (result.Succeeded)
            {
                TempData["SuccessMessage"] = "تم إعادة تعيين كلمة المرور بنجاح";
            }
            else
            {
                TempData["ErrorMessage"] = "حدث خطأ أثناء إعادة تعيين كلمة المرور";
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: UserManagement/ToggleActive/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleActive(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Check if user is admin
            if (await _userManager.IsInRoleAsync(user, "Admin"))
            {
                TempData["ErrorMessage"] = "لا يمكن تعطيل مدير النظام";
                return RedirectToAction(nameof(Index));
            }

            user.IsActive = !user.IsActive;
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                var status = user.IsActive ? "تفعيل" : "تعطيل";
                TempData["SuccessMessage"] = $"تم {status} المستخدم بنجاح";
            }
            else
            {
                TempData["ErrorMessage"] = "حدث خطأ أثناء تحديث حالة المستخدم";
            }

            return RedirectToAction(nameof(Index));
        }

        private async Task<bool> UserExistsAsync(string id)
        {
            return await _userManager.FindByIdAsync(id) != null;
        }
    }

    public class UserWithRoles
    {
        public ApplicationUser User { get; set; } = null!;
        public List<string> Roles { get; set; } = new List<string>();
    }
}
