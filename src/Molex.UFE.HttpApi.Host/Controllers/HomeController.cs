using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;
using System;
using System.Text.Json;
using Volo.Abp.AspNetCore.Mvc;

namespace Molex.UFE.Controllers;

public class HomeController : AbpController
{
    public ActionResult Index()
    {
#if DEBUG
        return Redirect("~/swagger");
#else
          return Redirect("~/healthz");
#endif
    }
    [HttpGet]
    [Microsoft.AspNetCore.Mvc.Route("SystemInfo")]
    public Task<string> SystemInfo()
    {
        return Task.FromResult(JsonSerializer.Serialize(new
        {
            Name = "UFE-VMS-SVC",
            Version = Environment.GetEnvironmentVariable("Version") ?? "1.0.0",
            SourceVersion = Environment.GetEnvironmentVariable("SourceVersion") ?? "N/A",
            BuildTime = Environment.GetEnvironmentVariable("BuildTime") ?? DateTime.Now.ToString("O"),
            Description = "UFE-VMS-SVC",
            Company = "Molex",
            ServerName = Environment.MachineName,
            IPAddress = GetLocalIPAddress(),
            Runtime = System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription
        }));
    }
    public string GetLocalIPAddress()
    {
        var host = Dns.GetHostEntry(Dns.GetHostName());
        foreach (var ip in host.AddressList)
        {
            if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
            {
                return ip.ToString();
            }
        }
        throw new Exception("No network adapters with an IPv4 address in the system!");
    }
}
