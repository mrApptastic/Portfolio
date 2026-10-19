using System.Globalization;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.JSInterop;
using Portfolio.App;
using Portfolio.App.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddScoped<IPortfolioService, PortfolioService>();
builder.Services.AddLocalization();

var host = builder.Build();

// Set culture from localStorage before first render
var js = host.Services.GetRequiredService<IJSRuntime>();
var cultureName = await js.InvokeAsync<string?>("localStorage.getItem", "portfolio-culture");
if (!string.IsNullOrWhiteSpace(cultureName))
{
    try
    {
        var culture = new CultureInfo(cultureName);
        CultureInfo.DefaultThreadCurrentCulture = culture;
        CultureInfo.DefaultThreadCurrentUICulture = culture;
    }
    catch { /* ignore invalid culture */ }
}
else
{
    // Default to Danish
    var defaultCulture = new CultureInfo("da");
    CultureInfo.DefaultThreadCurrentCulture = defaultCulture;
    CultureInfo.DefaultThreadCurrentUICulture = defaultCulture;
}

await host.RunAsync();
