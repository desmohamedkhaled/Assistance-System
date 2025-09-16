using AssistanceManagementSystem.Data;
using AssistanceManagementSystem.Models;
using Microsoft.AspNetCore.Identity;

namespace AssistanceManagementSystem.Services
{
    public interface IDataSeedService
    {
        Task SeedDataAsync(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager);
    }
}
