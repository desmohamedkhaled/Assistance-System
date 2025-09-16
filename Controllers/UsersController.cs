using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using AssistanceManagementSystem.Models;
using AssistanceManagementSystem.Data;
using Microsoft.EntityFrameworkCore;

namespace AssistanceManagementSystem.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UsersController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context,
            ILogger<UsersController> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _logger = logger;
        }

        // GET: Users
        public async Task<IActionResult> Index()
        {
            try
            {
                var users = await _userManager.Users
                    .Include(u => u.Branch)
                    .ToListAsync();

                var userViewModels = new List<UserViewModel>();

                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    userViewModels.Add(new UserViewModel
                    {
                        Id = user.Id,
                        UserName = user.UserName,
                        Email = user.Email,
                        FullName = user.FullName,
                        BranchName = user.Branch?.Name,
                        Roles = roles.ToList(),
                        IsActive = user.LockoutEnd == null || user.LockoutEnd < DateTimeOffset.Now
                    });
                }

                return View(userViewModels);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading users");
                return View(new List<UserViewModel>());
            }
        }

        // GET: Users/Create
        public async Task<IActionResult> Create()
        {
            var branches = await _context.Branches.ToListAsync();
            var roles = await _roleManager.Roles.ToListAsync();

            ViewBag.Branches = branches;
            ViewBag.Roles = roles;

            return View();
        }

        // POST: Users/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateUserViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = new ApplicationUser
                    {
                        UserName = model.UserName,
                        Email = model.Email,
                        FullName = model.FullName,
                        BranchId = model.BranchId,
                        EmailConfirmed = true
                    };

                    var result = await _userManager.CreateAsync(user, model.Password);

                    if (result.Succeeded)
                    {
                        if (!string.IsNullOrEmpty(model.SelectedRole))
                        {
                            await _userManager.AddToRoleAsync(user, model.SelectedRole);
                        }

                        TempData["SuccessMessage"] = "تم إنشاء المستخدم بنجاح";
                        return RedirectToAction(nameof(Index));
                    }

                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }

                var branches = await _context.Branches.ToListAsync();
                var roles = await _roleManager.Roles.ToListAsync();

                ViewBag.Branches = branches;
                ViewBag.Roles = roles;

                return View(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                TempData["ErrorMessage"] = "حدث خطأ أثناء إنشاء المستخدم";
                return RedirectToAction(nameof(Index));
            }
        }

        // GET: Users/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return NotFound();
                }

                var userRoles = await _userManager.GetRolesAsync(user);
                var branches = await _context.Branches.ToListAsync();
                var roles = await _roleManager.Roles.ToListAsync();

                var model = new EditUserViewModel
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    FullName = user.FullName,
                    BranchId = user.BranchId,
                    SelectedRole = userRoles.FirstOrDefault(),
                    IsActive = user.LockoutEnd == null || user.LockoutEnd < DateTimeOffset.Now
                };

                ViewBag.Branches = branches;
                ViewBag.Roles = roles;

                return View(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading user for edit");
                TempData["ErrorMessage"] = "حدث خطأ أثناء تحميل بيانات المستخدم";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Users/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, EditUserViewModel model)
        {
            if (id != model.Id)
            {
                return NotFound();
            }

            try
            {
                if (ModelState.IsValid)
                {
                    var user = await _userManager.FindByIdAsync(id);
                    if (user == null)
                    {
                        return NotFound();
                    }

                    user.UserName = model.UserName;
                    user.Email = model.Email;
                    user.FullName = model.FullName;
                    user.BranchId = model.BranchId;

                    var result = await _userManager.UpdateAsync(user);

                    if (result.Succeeded)
                    {
                        // Update password if provided
                        if (!string.IsNullOrEmpty(model.NewPassword))
                        {
                            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                            await _userManager.ResetPasswordAsync(user, token, model.NewPassword);
                        }

                        // Update role
                        var currentRoles = await _userManager.GetRolesAsync(user);
                        await _userManager.RemoveFromRolesAsync(user, currentRoles);

                        if (!string.IsNullOrEmpty(model.SelectedRole))
                        {
                            await _userManager.AddToRoleAsync(user, model.SelectedRole);
                        }

                        // Update lockout status
                        if (model.IsActive)
                        {
                            await _userManager.SetLockoutEndDateAsync(user, null);
                        }
                        else
                        {
                            await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
                        }

                        TempData["SuccessMessage"] = "تم تحديث المستخدم بنجاح";
                        return RedirectToAction(nameof(Index));
                    }

                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }

                var branches = await _context.Branches.ToListAsync();
                var roles = await _roleManager.Roles.ToListAsync();

                ViewBag.Branches = branches;
                ViewBag.Roles = roles;

                return View(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user");
                TempData["ErrorMessage"] = "حدث خطأ أثناء تحديث المستخدم";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Users/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return NotFound();
                }

                // Check if user is admin
                if (await _userManager.IsInRoleAsync(user, "Admin"))
                {
                    TempData["ErrorMessage"] = "لا يمكن حذف مدير النظام";
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

                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user");
                TempData["ErrorMessage"] = "حدث خطأ أثناء حذف المستخدم";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Users/ToggleStatus/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleStatus(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return NotFound();
            }

            try
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

                if (user.LockoutEnd == null || user.LockoutEnd < DateTimeOffset.Now)
                {
                    // Lock the user
                    await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
                    TempData["SuccessMessage"] = "تم تعطيل المستخدم بنجاح";
                }
                else
                {
                    // Unlock the user
                    await _userManager.SetLockoutEndDateAsync(user, null);
                    TempData["SuccessMessage"] = "تم تفعيل المستخدم بنجاح";
                }

                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling user status");
                TempData["ErrorMessage"] = "حدث خطأ أثناء تغيير حالة المستخدم";
                return RedirectToAction(nameof(Index));
            }
        }
    }

    // ViewModels for Users
    public class UserViewModel
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string BranchName { get; set; }
        public List<string> Roles { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateUserViewModel
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public int? BranchId { get; set; }
        public string Password { get; set; }
        public string SelectedRole { get; set; }
    }

    public class EditUserViewModel
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public int? BranchId { get; set; }
        public string NewPassword { get; set; }
        public string SelectedRole { get; set; }
        public bool IsActive { get; set; }
    }
}
