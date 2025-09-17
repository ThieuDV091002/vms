using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using System;


namespace Molex.UFE
{
    public static class OpenTelemetryHelper
    {
        public static IHostApplicationBuilder AddOpenTelemetry(this IHostApplicationBuilder builder)
        {

            var serviceName = builder.Environment.ApplicationName;
            var otlpEndpoint = builder.Configuration["OTLP_ENDPOINT_URL"];
            var prometheusEndpoint = builder.Configuration["Prometheus_ENDPOINT_URL"];
            builder.Logging.AddOpenTelemetry(options =>
            {
                options.SetResourceBuilder(ResourceBuilder.CreateDefault().AddService(serviceName, "Molex.UFE.DashBoard", "1.0", false, Environment.MachineName))
                    .AddOtlpExporter(op =>
                    {
                        op.Endpoint = new Uri(otlpEndpoint);
                    });
            });
            builder.Services.AddOpenTelemetry()
                  .ConfigureResource(resource => resource.AddService(serviceName, "Molex.UFE.DashBoard", "1.0", false, Environment.MachineName))
                  .WithTracing(tracing => tracing
                       .AddAspNetCoreInstrumentation()
                      .AddHttpClientInstrumentation()
                      .AddOtlpExporter(op => { op.Endpoint = new Uri(otlpEndpoint); }))
                  .WithMetrics(metrics => metrics
                      .SetResourceBuilder(ResourceBuilder.CreateDefault()
                            .AddService(serviceName, "Molex.UFE.DashBoard", "1.0", false, Environment.MachineName))
                    .AddRuntimeInstrumentation()
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddEventCountersInstrumentation(c =>
                    {
                        c.AddEventSources(
                                "Microsoft.AspNetCore.Hosting",
                                "Microsoft-AspNetCore-Server-Kestrel",
                                "System.Net.Http",
                                "System.Net.Sockets");
                    })
                    .AddPrometheusExporter()
                      .AddOtlpExporter(op => { op.Endpoint = new Uri(otlpEndpoint); }));
            return builder;
        }


    }
}
