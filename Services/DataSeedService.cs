using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using AssistanceManagementSystem.Data;
using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.Services
{
    public class DataSeedService : IDataSeedService
    {
        public async Task SeedDataAsync(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Seed roles
            await SeedRolesAsync(roleManager);

            // Seed branches
            await SeedBranchesAsync(context);

            // Seed users
            await SeedUsersAsync(context, userManager);

            // Seed organizations
            await SeedOrganizationsAsync(context);

            // Seed projects
            await SeedProjectsAsync(context);

            // Seed beneficiaries
            await SeedBeneficiariesAsync(context);

            // Seed assistances
            await SeedAssistancesAsync(context, userManager);
        }

        private async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            var roles = new[] { "Admin", "BranchManager", "Staff", "Approver", "Beneficiary" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        private async Task SeedBranchesAsync(ApplicationDbContext context)
        {
            if (!await context.Branches.AnyAsync())
            {
                var branches = new List<Branch>
                {
                    new Branch { Name = "القاهرة - المقطم", Address = "المقطم، القاهرة", Phone = "02-12345678" },
                    new Branch { Name = "القاهرة - الزيتون", Address = "الزيتون، القاهرة", Phone = "02-12345679" },
                    new Branch { Name = "القاهرة - السابع", Address = "السابع، القاهرة", Phone = "02-12345680" },
                    new Branch { Name = "القاهرة - اسماء فهمي", Address = "اسماء فهمي (الحي)، القاهرة", Phone = "02-12345681" },
                    new Branch { Name = "القاهرة - النصر", Address = "النصر، القاهرة", Phone = "02-12345682" },
                    new Branch { Name = "القاهرة - حلوان", Address = "حلوان، القاهرة", Phone = "02-12345683" },
                    new Branch { Name = "القاهرة - عين حلوان", Address = "عين حلوان، القاهرة", Phone = "02-12345684" },
                    new Branch { Name = "الاسكندرية - السلطان حسين", Address = "السلطان حسين، الإسكندرية", Phone = "03-87654321" },
                    new Branch { Name = "الزقازيق - مشتول", Address = "مشتول، الزقازيق", Phone = "055-1234567" },
                    new Branch { Name = "الزقازيق - ميت العز", Address = "ميت العز، الزقازيق", Phone = "055-1234568" }
                };

                context.Branches.AddRange(branches);
                await context.SaveChangesAsync();
            }
        }

        private async Task SeedUsersAsync(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            if (!await context.Users.AnyAsync())
            {
                var branches = await context.Branches.ToListAsync();

                // Admin user
                var admin = new ApplicationUser
                {
                    UserName = "admin",
                    Email = "admin@ams.org",
                    FullName = "مدير النظام العام",
                    PhoneNumber = "01000000000",
                    EmailConfirmed = true,
                    IsActive = true
                };

                await userManager.CreateAsync(admin, "Admin123!");
                await userManager.AddToRoleAsync(admin, "Admin");

                // Branch managers
                for (int i = 0; i < Math.Min(5, branches.Count); i++)
                {
                    var manager = new ApplicationUser
                    {
                        UserName = $"manager_{i + 1}",
                        Email = $"manager{i + 1}@ams.org",
                        FullName = $"مدير فرع {branches[i].Name}",
                        PhoneNumber = $"0100000000{i + 1}",
                        BranchId = branches[i].Id,
                        EmailConfirmed = true,
                        IsActive = true
                    };

                    await userManager.CreateAsync(manager, "Manager123!");
                    await userManager.AddToRoleAsync(manager, "BranchManager");

                    // Update branch manager
                    branches[i].ManagerId = manager.Id;
                }

                // Staff users
                for (int i = 0; i < Math.Min(3, branches.Count); i++)
                {
                    var staff = new ApplicationUser
                    {
                        UserName = $"staff_{i + 1}",
                        Email = $"staff{i + 1}@ams.org",
                        FullName = $"موظف {branches[i].Name}",
                        PhoneNumber = $"0100000010{i + 1}",
                        BranchId = branches[i].Id,
                        EmailConfirmed = true,
                        IsActive = true
                    };

                    await userManager.CreateAsync(staff, "Staff123!");
                    await userManager.AddToRoleAsync(staff, "Staff");
                }

                // Approvers
                for (int i = 0; i < 2; i++)
                {
                    var approver = new ApplicationUser
                    {
                        UserName = $"approver_{i + 1}",
                        Email = $"approver{i + 1}@ams.org",
                        FullName = $"موافق {i + 1}",
                        PhoneNumber = $"0100000020{i + 1}",
                        EmailConfirmed = true,
                        IsActive = true
                    };

                    await userManager.CreateAsync(approver, "Approver123!");
                    await userManager.AddToRoleAsync(approver, "Approver");
                }

                // Beneficiaries
                for (int i = 0; i < 3; i++)
                {
                    var beneficiary = new ApplicationUser
                    {
                        UserName = $"beneficiary_{i + 1}",
                        Email = $"beneficiary{i + 1}@ams.org",
                        FullName = $"مستفيد {i + 1}",
                        PhoneNumber = $"0100000030{i + 1}",
                        EmailConfirmed = true,
                        IsActive = true
                    };

                    await userManager.CreateAsync(beneficiary, "Beneficiary123!");
                    await userManager.AddToRoleAsync(beneficiary, "Beneficiary");
                }

                await context.SaveChangesAsync();
            }
        }

        private async Task SeedOrganizationsAsync(ApplicationDbContext context)
        {
            if (!await context.Organizations.AnyAsync())
            {
                var organizations = new List<Organization>
                {
                    new Organization
                    {
                        Name = "مؤسسة الخير للتنمية الاجتماعية",
                        Type = "خيرية",
                        Address = "القاهرة - حي مصر الجديدة",
                        Phone = "0223456789",
                        AccountNumber = "EG12345678901234567890",
                        ContactPerson = "أحمد محمد علي",
                        Email = "info@alkhair.org"
                    },
                    new Organization
                    {
                        Name = "جمعية البر والإحسان",
                        Type = "خيرية",
                        Address = "الإسكندرية - حي سيدي بشر",
                        Phone = "0323456789",
                        AccountNumber = "EG23456789012345678901",
                        ContactPerson = "فاطمة أحمد محمد",
                        Email = "info@alber.org"
                    },
                    new Organization
                    {
                        Name = "مؤسسة الأمل للرعاية الصحية",
                        Type = "طبية",
                        Address = "الجيزة - حي الدقي",
                        Phone = "0223456789",
                        AccountNumber = "EG34567890123456789012",
                        ContactPerson = "د. محمد علي حسن",
                        Email = "info@alamal-medical.org"
                    },
                    new Organization
                    {
                        Name = "جمعية التكافل الاجتماعي",
                        Type = "اجتماعية",
                        Address = "القاهرة - حي المعادي",
                        Phone = "0223456789",
                        AccountNumber = "EG45678901234567890123",
                        ContactPerson = "سارة عبدالله خالد",
                        Email = "info@altakafol.org"
                    },
                    new Organization
                    {
                        Name = "مؤسسة النور التعليمية",
                        Type = "تعليمية",
                        Address = "القاهرة - حي الزمالك",
                        Phone = "0223456789",
                        AccountNumber = "EG56789012345678901234",
                        ContactPerson = "عبدالرحمن خالد سعد",
                        Email = "info@alnour-edu.org"
                    }
                };

                context.Organizations.AddRange(organizations);
                await context.SaveChangesAsync();
            }
        }

        private async Task SeedProjectsAsync(ApplicationDbContext context)
        {
            if (!await context.Projects.AnyAsync())
            {
                var organizations = await context.Organizations.ToListAsync();

                var projects = new List<Project>
                {
                    new Project
                    {
                        Name = "مشروع كفالة الأيتام",
                        Type = "اجتماعي",
                        Address = "القاهرة - حي مصر الجديدة",
                        Phone = "0223456789",
                        Status = "نشط",
                        StartDate = new DateTime(2024, 1, 1),
                        EndDate = new DateTime(2024, 12, 31),
                        Description = "مشروع شامل لكفالة الأيتام وتوفير الرعاية الكاملة لهم",
                        OrganizationId = organizations[0].Id,
                        Budget = 500000
                    },
                    new Project
                    {
                        Name = "مشروع الرعاية الصحية",
                        Type = "طبي",
                        Address = "الإسكندرية - حي سيدي بشر",
                        Phone = "0323456789",
                        Status = "نشط",
                        StartDate = new DateTime(2024, 1, 15),
                        EndDate = new DateTime(2024, 12, 31),
                        Description = "تقديم الرعاية الصحية المجانية للمحتاجين",
                        OrganizationId = organizations[2].Id,
                        Budget = 750000
                    },
                    new Project
                    {
                        Name = "مشروع التعليم للجميع",
                        Type = "تعليمي",
                        Address = "الجيزة - حي الدقي",
                        Phone = "0223456789",
                        Status = "قيد التنفيذ",
                        StartDate = new DateTime(2024, 2, 1),
                        EndDate = new DateTime(2024, 11, 30),
                        Description = "توفير التعليم المجاني للأطفال المحتاجين",
                        OrganizationId = organizations[4].Id,
                        Budget = 300000
                    }
                };

                context.Projects.AddRange(projects);
                await context.SaveChangesAsync();
            }
        }

        private async Task SeedBeneficiariesAsync(ApplicationDbContext context)
        {
            if (!await context.Beneficiaries.AnyAsync())
            {
                var branches = await context.Branches.Take(5).ToListAsync();

                var beneficiaries = new List<Beneficiary>
                {
                    new Beneficiary
                    {
                        FullName = "فاطمة أحمد محمد علي",
                        FirstName = "فاطمة",
                        SecondName = "أحمد",
                        ThirdName = "محمد",
                        LastName = "علي",
                        NationalId = "12345678901234",
                        Phone = "01012345678",
                        Address = "القاهرة - حي مصر الجديدة",
                        Gender = "أنثى",
                        Religion = "مسلمة",
                        MaritalStatus = "أرملة",
                        FamilyMembers = 4,
                        Income = 2500,
                        BranchId = branches[0].Id
                    },
                    new Beneficiary
                    {
                        FullName = "محمد علي حسن عبدالله",
                        FirstName = "محمد",
                        SecondName = "علي",
                        ThirdName = "حسن",
                        LastName = "عبدالله",
                        NationalId = "23456789012345",
                        Phone = "01023456789",
                        Address = "الإسكندرية - حي سيدي بشر",
                        Gender = "ذكر",
                        Religion = "مسلم",
                        MaritalStatus = "متزوج",
                        FamilyMembers = 6,
                        Income = 4200,
                        BranchId = branches[1].Id
                    },
                    new Beneficiary
                    {
                        FullName = "سارة عبدالله خالد سعد",
                        FirstName = "سارة",
                        SecondName = "عبدالله",
                        ThirdName = "خالد",
                        LastName = "سعد",
                        NationalId = "34567890123456",
                        Phone = "01034567890",
                        Address = "الجيزة - حي الدقي",
                        Gender = "أنثى",
                        Religion = "مسلمة",
                        MaritalStatus = "عزباء",
                        FamilyMembers = 2,
                        Income = 1800,
                        BranchId = branches[2].Id
                    },
                    new Beneficiary
                    {
                        FullName = "عبدالرحمن خالد سعد محمد",
                        FirstName = "عبدالرحمن",
                        SecondName = "خالد",
                        ThirdName = "سعد",
                        LastName = "محمد",
                        NationalId = "45678901234567",
                        Phone = "01045678901",
                        Address = "القاهرة - حي المعادي",
                        Gender = "ذكر",
                        Religion = "مسلم",
                        MaritalStatus = "متزوج",
                        FamilyMembers = 5,
                        Income = 3500,
                        BranchId = branches[3].Id
                    },
                    new Beneficiary
                    {
                        FullName = "نورا سعد محمد علي",
                        FirstName = "نورا",
                        SecondName = "سعد",
                        ThirdName = "محمد",
                        LastName = "علي",
                        NationalId = "56789012345678",
                        Phone = "01056789012",
                        Address = "القاهرة - حي الزمالك",
                        Gender = "أنثى",
                        Religion = "مسلمة",
                        MaritalStatus = "مطلقة",
                        FamilyMembers = 3,
                        Income = 2200,
                        BranchId = branches[4].Id
                    }
                };

                context.Beneficiaries.AddRange(beneficiaries);
                await context.SaveChangesAsync();
            }
        }

        private async Task SeedAssistancesAsync(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            if (!await context.Assistances.AnyAsync())
            {
                var beneficiaries = await context.Beneficiaries.ToListAsync();
                var staffUsers = await userManager.GetUsersInRoleAsync("Staff");
                var approverUsers = await userManager.GetUsersInRoleAsync("Approver");

                var assistances = new List<Assistance>
                {
                    new Assistance
                    {
                        BeneficiaryId = beneficiaries[0].Id,
                        Type = "طبية",
                        Amount = 4500,
                        PaymentMethod = "تحويل بنكي",
                        Status = "مدفوع",
                        Date = DateTime.UtcNow.AddDays(-10),
                        Notes = "علاج طبي عاجل لمرض الكلى - تم اعتماد الطلب بعد مراجعة الحالة الطبية",
                        CreatedByUserId = staffUsers.First().Id,
                        ApprovedByUserId = approverUsers.First().Id,
                        ApprovedAt = DateTime.UtcNow.AddDays(-8),
                        PaidAt = DateTime.UtcNow.AddDays(-5),
                        PaidByUserId = approverUsers.First().Id
                    },
                    new Assistance
                    {
                        BeneficiaryId = beneficiaries[1].Id,
                        Type = "أيتام",
                        Amount = 3000,
                        PaymentMethod = "نقدي",
                        Status = "معتمد",
                        Date = DateTime.UtcNow.AddDays(-8),
                        Notes = "مساعدة مالية لرعاية الأيتام - تم اعتماد المبلغ المطلوب بالكامل",
                        CreatedByUserId = staffUsers.First().Id,
                        ApprovedByUserId = approverUsers.First().Id,
                        ApprovedAt = DateTime.UtcNow.AddDays(-6)
                    },
                    new Assistance
                    {
                        BeneficiaryId = beneficiaries[2].Id,
                        Type = "تعليمية",
                        Amount = 3500,
                        PaymentMethod = "حساب داخلي",
                        Status = "معلق",
                        Date = DateTime.UtcNow.AddDays(-5),
                        Notes = "رسوم دراسية للفصل الدراسي الجديد",
                        CreatedByUserId = staffUsers.First().Id
                    },
                    new Assistance
                    {
                        BeneficiaryId = beneficiaries[3].Id,
                        Type = "ذوي الاحتياجات",
                        Amount = 5500,
                        PaymentMethod = "فيزا",
                        Status = "مدفوع",
                        Date = DateTime.UtcNow.AddDays(-7),
                        Notes = "شراء كرسي متحرك ومساعدات طبية - تم اعتماد الطلب مع تخفيض طفيف في المبلغ",
                        CreatedByUserId = staffUsers.First().Id,
                        ApprovedByUserId = approverUsers.First().Id,
                        ApprovedAt = DateTime.UtcNow.AddDays(-5),
                        PaidAt = DateTime.UtcNow.AddDays(-3),
                        PaidByUserId = approverUsers.First().Id
                    },
                    new Assistance
                    {
                        BeneficiaryId = beneficiaries[4].Id,
                        Type = "أرامل",
                        Amount = 2500,
                        PaymentMethod = "تحويل بنكي",
                        Status = "معتمد",
                        Date = DateTime.UtcNow.AddDays(-5),
                        Notes = "مساعدة مالية شهرية للأرملة وأطفالها - تم اعتماد المبلغ المطلوب",
                        CreatedByUserId = staffUsers.First().Id,
                        ApprovedByUserId = approverUsers.First().Id,
                        ApprovedAt = DateTime.UtcNow.AddDays(-3)
                    }
                };

                context.Assistances.AddRange(assistances);
                await context.SaveChangesAsync();
            }
        }
    }
}
