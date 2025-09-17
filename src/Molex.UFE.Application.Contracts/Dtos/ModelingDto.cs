using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Volo.Abp.Application.Dtos;

namespace Molex.UFE.Dtos
{

   

    public class ModelingInput<TKey>: PagedAndSortedResultRequestDto
    {
        public TKey Id { get; set; }
    }

    
    public class ImportResultItemDto
    {
        public string Name { get; set; }
        public string ErrorMessage { get; set; }

    }

    public class ExportNameObjectDto
    {
        [Required]
        public virtual string Name { get; set; }

        public string? Description { get; set; } = string.Empty;

        public string? DisplayName { get; set; }

    }
}
