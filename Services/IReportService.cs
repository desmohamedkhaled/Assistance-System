using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.Services
{
    public interface IReportService
    {
        Task<byte[]> GeneratePdfReportAsync(List<Models.Assistance> assistances, string title);
        Task<byte[]> GenerateExcelReportAsync(List<Models.Assistance> assistances, string title);
        Task<List<Models.Assistance>> GetFilteredAssistancesAsync(string? type, string? status, DateTime? fromDate, DateTime? toDate, int? branchId);
        Task<DashboardStatistics> GetDashboardStatisticsAsync();
    }

    public class DashboardStatistics
    {
        public int TotalBeneficiaries { get; set; }
        public int TotalAssistances { get; set; }
        public int TotalOrganizations { get; set; }
        public int TotalProjects { get; set; }
        public decimal TotalPaidAmount { get; set; }
        public decimal TotalPendingAmount { get; set; }
        public decimal TotalApprovedAmount { get; set; }
        public int MaleBeneficiaries { get; set; }
        public int FemaleBeneficiaries { get; set; }
        public decimal AverageAssistanceAmount { get; set; }
    }
}
