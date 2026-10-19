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
            var result = await http.GetFromJsonAsync<PortfolioList>($"{ApiBase}{language}");
            return result;
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
