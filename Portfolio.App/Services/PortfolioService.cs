using System.Net.Http.Json;
using Portfolio.App.Models;

namespace Portfolio.App.Services;

public class PortfolioService(HttpClient http) : IPortfolioService
{
    private const string ApiBase = "https://portfolio.tesj.dk/api/portfolio/getall/";
    private const string FallbackBase = "sample-data/";

    public async Task<PortfolioList?> GetPortfolioAsync(string language)
    {
        try
        {
            return await http.GetFromJsonAsync<PortfolioList>($"{FallbackBase}{language}.json?v=" + DateTime.Now.Ticks);
        }
        catch
        {
            return new PortfolioList();
        }
    }

    public async Task<PortfolioList?> GetPortfolioAsync2(string language)
    {
        try
        {
            return await http.GetFromJsonAsync<PortfolioList>($"{ApiBase}{language}");
        }
        catch
        {
            try
            {
                return await http.GetFromJsonAsync<PortfolioList>($"{FallbackBase}{language}.json");
            }
            catch
            {
                return new PortfolioList();
            }
        }
    }
}
