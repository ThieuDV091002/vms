using System;
using System.Diagnostics;
using System.Text.Json;

namespace Molex.UFE
{
    public static class ErrorDetailHelper
    {
        public static string GetErrorDetail(string nextAction, string errorTitle)
        {
            var error = new ErrorInfo
            {
                NextAction = nextAction,
                TraceId = Activity.Current?.TraceId.ToString() ?? "No trace ID available",
                ErrorTitle = errorTitle
            };
            return JsonSerializer.Serialize(error);
        }

        private class ErrorInfo
        {
            public string TraceId { get; set; }
            public string NextAction { get; set; }
            public string ErrorTitle { get; set; }
        }
    }
}
