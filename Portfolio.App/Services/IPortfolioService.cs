using Portfolio.App.Models;

namespace Portfolio.App.Services;

public interface IPortfolioService
{
    Task<PortfolioList?> GetPortfolioAsync(string language);
}
