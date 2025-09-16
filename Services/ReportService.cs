using Microsoft.EntityFrameworkCore;
using AssistanceManagementSystem.Data;
using AssistanceManagementSystem.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ClosedXML.Excel;
using System.Text;

namespace AssistanceManagementSystem.Services
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;

        public ReportService(ApplicationDbContext context)
        {
            _context = context;
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public Task<byte[]> GeneratePdfReportAsync(List<Models.Assistance> assistances, string title)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header()
                        .Text(title)
                        .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(x =>
                        {
                            x.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.ConstantColumn(50);
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Element(CellStyle).Text("ID");
                                    header.Cell().Element(CellStyle).Text("المستفيد");
                                    header.Cell().Element(CellStyle).Text("النوع");
                                    header.Cell().Element(CellStyle).Text("المبلغ");
                                    header.Cell().Element(CellStyle).Text("الحالة");
                                    header.Cell().Element(CellStyle).Text("التاريخ");

                                    static IContainer CellStyle(IContainer container)
                                    {
                                        return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                                    }
                                });

                                foreach (var assistance in assistances)
                                {
                                    table.Cell().Element(CellStyle).Text(assistance.Id.ToString());
                                    table.Cell().Element(CellStyle).Text(assistance.Beneficiary.FullName);
                                    table.Cell().Element(CellStyle).Text(assistance.Type);
                                    table.Cell().Element(CellStyle).Text(assistance.Amount.ToString("C"));
                                    table.Cell().Element(CellStyle).Text(assistance.Status);
                                    table.Cell().Element(CellStyle).Text(assistance.Date.ToString("yyyy-MM-dd"));

                                    static IContainer CellStyle(IContainer container)
                                    {
                                        return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                                    }
                                }
                            });
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("صفحة ");
                            x.CurrentPageNumber();
                            x.Span(" من ");
                            x.TotalPages();
                        });
                });
            });

            return Task.FromResult(document.GeneratePdf());
        }

        public Task<byte[]> GenerateExcelReportAsync(List<Models.Assistance> assistances, string title)
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("تقرير المساعدات");

            // Add title
            worksheet.Cell(1, 1).Value = title;
            worksheet.Cell(1, 1).Style.Font.Bold = true;
            worksheet.Cell(1, 1).Style.Font.FontSize = 16;

            // Add headers
            var headers = new[] { "ID", "المستفيد", "النوع", "المبلغ", "الحالة", "التاريخ", "الملاحظات" };
            for (int i = 0; i < headers.Length; i++)
            {
                worksheet.Cell(3, i + 1).Value = headers[i];
                worksheet.Cell(3, i + 1).Style.Font.Bold = true;
                worksheet.Cell(3, i + 1).Style.Fill.BackgroundColor = XLColor.LightBlue;
            }

            // Add data
            for (int i = 0; i < assistances.Count; i++)
            {
                var assistance = assistances[i];
                var row = i + 4;
                
                worksheet.Cell(row, 1).Value = assistance.Id;
                worksheet.Cell(row, 2).Value = assistance.Beneficiary.FullName;
                worksheet.Cell(row, 3).Value = assistance.Type;
                worksheet.Cell(row, 4).Value = assistance.Amount;
                worksheet.Cell(row, 5).Value = assistance.Status;
                worksheet.Cell(row, 6).Value = assistance.Date.ToString("yyyy-MM-dd");
                worksheet.Cell(row, 7).Value = assistance.Notes ?? "";
            }

            // Auto-fit columns
            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return Task.FromResult(stream.ToArray());
        }

        public async Task<List<Models.Assistance>> GetFilteredAssistancesAsync(string? type, string? status, DateTime? fromDate, DateTime? toDate, int? branchId)
        {
            var query = _context.Assistances
                .Include(a => a.Beneficiary)
                .Include(a => a.CreatedByUser)
                .AsQueryable();

            if (!string.IsNullOrEmpty(type))
                query = query.Where(a => a.Type == type);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(a => a.Status == status);

            if (fromDate.HasValue)
                query = query.Where(a => a.Date >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(a => a.Date <= toDate.Value);

            if (branchId.HasValue)
                query = query.Where(a => a.Beneficiary.BranchId == branchId.Value);

            return await query.OrderByDescending(a => a.Date).ToListAsync();
        }

        public async Task<DashboardStatistics> GetDashboardStatisticsAsync()
        {
            var totalBeneficiaries = await _context.Beneficiaries.CountAsync();
            var totalAssistances = await _context.Assistances.CountAsync();
            var totalOrganizations = await _context.Organizations.CountAsync();
            var totalProjects = await _context.Projects.CountAsync();

            var totalPaidAmount = await _context.Assistances
                .Where(a => a.Status == "مدفوع")
                .SumAsync(a => a.Amount);

            var totalPendingAmount = await _context.Assistances
                .Where(a => a.Status == "معلق")
                .SumAsync(a => a.Amount);

            var totalApprovedAmount = await _context.Assistances
                .Where(a => a.Status == "معتمد")
                .SumAsync(a => a.Amount);

            var maleBeneficiaries = await _context.Beneficiaries
                .CountAsync(b => b.Gender == "ذكر");

            var femaleBeneficiaries = await _context.Beneficiaries
                .CountAsync(b => b.Gender == "أنثى");

            var averageAssistanceAmount = await _context.Assistances
                .AverageAsync(a => a.Amount);

            return new DashboardStatistics
            {
                TotalBeneficiaries = totalBeneficiaries,
                TotalAssistances = totalAssistances,
                TotalOrganizations = totalOrganizations,
                TotalProjects = totalProjects,
                TotalPaidAmount = totalPaidAmount,
                TotalPendingAmount = totalPendingAmount,
                TotalApprovedAmount = totalApprovedAmount,
                MaleBeneficiaries = maleBeneficiaries,
                FemaleBeneficiaries = femaleBeneficiaries,
                AverageAssistanceAmount = averageAssistanceAmount
            };
        }
    }
}
