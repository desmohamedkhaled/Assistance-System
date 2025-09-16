using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Branch> Branches { get; set; }
        public DbSet<Beneficiary> Beneficiaries { get; set; }
        public DbSet<Assistance> Assistances { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Project> Projects { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure ApplicationUser relationships
            builder.Entity<ApplicationUser>()
                .HasOne(u => u.Branch)
                .WithMany(b => b.Users)
                .HasForeignKey(u => u.BranchId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure Branch relationships
            builder.Entity<Branch>()
                .HasOne(b => b.Manager)
                .WithMany()
                .HasForeignKey(b => b.ManagerId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure Beneficiary relationships
            builder.Entity<Beneficiary>()
                .HasOne(b => b.Branch)
                .WithMany(br => br.Beneficiaries)
                .HasForeignKey(b => b.BranchId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure Assistance relationships
            builder.Entity<Assistance>()
                .HasOne(a => a.Beneficiary)
                .WithMany(b => b.Assistances)
                .HasForeignKey(a => a.BeneficiaryId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Assistance>()
                .HasOne(a => a.CreatedByUser)
                .WithMany()
                .HasForeignKey(a => a.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Assistance>()
                .HasOne(a => a.ApprovedByUser)
                .WithMany()
                .HasForeignKey(a => a.ApprovedByUserId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Assistance>()
                .HasOne(a => a.PaidByUser)
                .WithMany()
                .HasForeignKey(a => a.PaidByUserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure Project relationships
            builder.Entity<Project>()
                .HasOne(p => p.Organization)
                .WithMany(o => o.Projects)
                .HasForeignKey(p => p.OrganizationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure unique constraints
            builder.Entity<Beneficiary>()
                .HasIndex(b => b.NationalId)
                .IsUnique();

            // Configure decimal precision
            builder.Entity<Assistance>()
                .Property(a => a.Amount)
                .HasPrecision(18, 2);

            builder.Entity<Project>()
                .Property(p => p.Budget)
                .HasPrecision(18, 2);

            builder.Entity<Beneficiary>()
                .Property(b => b.Income)
                .HasPrecision(18, 2);
        }
    }
}
