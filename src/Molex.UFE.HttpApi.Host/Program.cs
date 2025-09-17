using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;

namespace Molex.UFE;

public class Program
{
    public async static Task<int> Main(string[] args)
    {
        try
        {
            var builder = WebApplication.CreateBuilder(args);
        Log.Logger = new LoggerConfiguration()
#if DEBUG
            .MinimumLevel.Debug()
#else
            .MinimumLevel.Information()
#endif
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
            .Enrich.FromLogContext()
#if DEBUG
            .WriteTo.Async(c => c.File("Logs/logs.txt"))
#endif
            .WriteTo.Async(c => c.Console())
             .WriteTo.OpenTelemetry(options =>
             {
                 options.Endpoint = builder.Configuration["OTLP_ENDPOINT_URL"];
                 options.ResourceAttributes = new Dictionary<string, object>
                 {
                     ["service.name"] = Environment.MachineName
                 };
             }

                )
            .CreateLogger();
        builder.AddOpenTelemetry();
        builder.Host.AddAppSettingsSecretsJson()
            .UseAutofac()
            .UseSerilog()
           ;

       
            Log.Information("Starting Molex.UFE.HttpApi.Host.");
           
           
            await builder.AddApplicationAsync<UFEHttpApiHostModule>();
            builder.Services.AddHealthChecks();
            var app = builder.Build();
            app.MapHealthChecks("/healthz");
            await app.InitializeApplicationAsync();
            app.UseAuthentication();
            app.UseAuthorization();
            await app.RunAsync();
            return 0;
        }
        catch (Exception ex)
        {
            if (ex is HostAbortedException)
            {
                throw;
            }

            Log.Fatal(ex, "Host terminated unexpectedly!");
            return 1;
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }
}
