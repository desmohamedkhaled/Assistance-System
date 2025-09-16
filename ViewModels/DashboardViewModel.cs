using AssistanceManagementSystem.Models;

namespace AssistanceManagementSystem.ViewModels
{
    public class DashboardViewModel
    {
        // Statistics
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

        // Recent assistances
        public List<AssistanceViewModel> RecentAssistances { get; set; } = new List<AssistanceViewModel>();

        // Chart data
        public List<ChartData> AssistanceTypeData { get; set; } = new List<ChartData>();
        public List<ChartData> MonthlyAssistanceData { get; set; } = new List<ChartData>();
        public List<ChartData> StatusDistributionData { get; set; } = new List<ChartData>();

        // User info
        public string? UserName { get; set; }
        public string? UserRole { get; set; }
        public bool IsBeneficiary { get; set; }

        // Beneficiary specific data
        public List<AssistanceViewModel> UserAssistances { get; set; } = new List<AssistanceViewModel>();
        public int UserPendingRequests { get; set; }
        public int UserApprovedRequests { get; set; }
        public int UserPaidRequests { get; set; }
        public decimal UserTotalReceived { get; set; }
        public decimal UserTotalPending { get; set; }
    }

    public class ChartData
    {
        public string Label { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public string Color { get; set; } = string.Empty;
    }
}
