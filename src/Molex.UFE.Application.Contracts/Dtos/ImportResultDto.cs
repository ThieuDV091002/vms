using System.Collections.Generic;

namespace Molex.UFE.Dtos
{
    public class ImportResultDto
    {
        public bool Status { get; set; }
        public int TotalCount { get; set; }
        public int SuccessCount { get; set; }
        public int FailedCount { get; set; }
        public List<FailedImportResultItemDto> Items { get; set; } = new List<FailedImportResultItemDto>();
    }
}
