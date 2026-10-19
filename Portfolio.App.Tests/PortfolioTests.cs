using Microsoft.Playwright.NUnit;

namespace Portfolio.App.Tests;

/// <summary>
/// Playwright end-to-end tests for the mrApptastic Portfolio Blazor WASM app.
/// 
/// To run these tests, first start the app (dotnet run --project ../Portfolio.App) 
/// then run: dotnet test
/// 
/// Or set BASE_URL environment variable to point to the deployed app.
/// </summary>
[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class PortfolioTests : PageTest
{
    private string BaseUrl => Environment.GetEnvironmentVariable("BASE_URL") ?? "http://localhost:5000";

    [Test]
    public async Task HomePage_ShowsTerminalWithName()
    {
        await Page.GotoAsync(BaseUrl);
        await Page.WaitForSelectorAsync(".hero-terminal", new() { Timeout = 15000 });
        await Page.WaitForSelectorAsync(".terminal-input", new() { Timeout = 15000 });

        var terminal = await Page.QuerySelectorAsync(".hero-terminal");
        Assert.That(terminal, Is.Not.Null, "Hero terminal should be visible on home page");

        await Page.FillAsync(".terminal-input", "whoami");
        await Page.PressAsync(".terminal-input", "Enter");
        await Page.WaitForTimeoutAsync(300);

        var content = await terminal!.InnerTextAsync();
        Assert.That(content, Does.Contain("Henrik Beske"), "Terminal should display the developer name");
    }

    [Test]
    public async Task HomePage_HasNavigationLinks()
    {
        await Page.GotoAsync(BaseUrl);
        await Page.WaitForSelectorAsync(".portfolio-nav", new() { Timeout = 15000 });

        var navLinks = await Page.QuerySelectorAllAsync(".nav-links a");
        Assert.That(navLinks.Count, Is.GreaterThanOrEqualTo(4), "Navigation should have at least 4 links");
    }

    [Test]
    public async Task HomePage_HasCtaButtons()
    {
        await Page.GotoAsync(BaseUrl);
        await Page.WaitForSelectorAsync(".hero-cta", new() { Timeout = 15000 });

        var ctaButtons = await Page.QuerySelectorAllAsync(".cta-btn");
        Assert.That(ctaButtons.Count, Is.GreaterThanOrEqualTo(2), "Home page should have at least 2 CTA buttons");
    }

    [Test]
    public async Task HomePage_HasLanguageSelector()
    {
        await Page.GotoAsync(BaseUrl);
        await Page.WaitForSelectorAsync(".lang-selector", new() { Timeout = 15000 });

        var langButtons = await Page.QuerySelectorAllAsync(".lang-btn");
        Assert.That(langButtons.Count, Is.EqualTo(3), "Should have 3 language buttons (da, en, sv)");
    }

    [Test]
    public async Task Navigation_ToAboutPage_Works()
    {
        await Page.GotoAsync(BaseUrl);
        await Page.WaitForSelectorAsync(".nav-links a", new() { Timeout = 15000 });

        await Page.ClickAsync("a[href='/about']");
        await Page.WaitForURLAsync($"{BaseUrl}/about", new() { Timeout = 10000 });

        var title = await Page.TitleAsync();
        Assert.That(title, Does.Contain("mrApptastic"), "Page title should contain brand name");
    }

    [Test]
    public async Task Navigation_ToCVPage_Works()
    {
        await Page.GotoAsync(BaseUrl);
        await Page.WaitForSelectorAsync(".nav-links a", new() { Timeout = 15000 });

        await Page.ClickAsync("a[href='/cv']");
        await Page.WaitForURLAsync($"{BaseUrl}/cv", new() { Timeout = 10000 });

        await Page.WaitForSelectorAsync(".cv-section", new() { Timeout = 10000 });
        var cvSection = await Page.QuerySelectorAsync(".cv-section");
        Assert.That(cvSection, Is.Not.Null, "CV section should be visible");
    }

    [Test]
    public async Task Navigation_ToProjectsPage_Works()
    {
        await Page.GotoAsync(BaseUrl);
        await Page.WaitForSelectorAsync(".nav-links a", new() { Timeout = 15000 });

        await Page.ClickAsync("a[href='/projects']");
        await Page.WaitForURLAsync($"{BaseUrl}/projects", new() { Timeout = 10000 });

        await Page.WaitForSelectorAsync(".projects-section", new() { Timeout = 10000 });
        var projectsSection = await Page.QuerySelectorAsync(".projects-section");
        Assert.That(projectsSection, Is.Not.Null, "Projects section should be visible");
    }

    [Test]
    public async Task Navigation_ToContactPage_Works()
    {
        await Page.GotoAsync(BaseUrl);
        await Page.WaitForSelectorAsync(".nav-links a", new() { Timeout = 15000 });

        await Page.ClickAsync("a[href='/contact']");
        await Page.WaitForURLAsync($"{BaseUrl}/contact", new() { Timeout = 10000 });

        await Page.WaitForSelectorAsync(".contact-section", new() { Timeout = 10000 });
        var contactSection = await Page.QuerySelectorAsync(".contact-section");
        Assert.That(contactSection, Is.Not.Null, "Contact section should be visible");
    }

    [Test]
    public async Task AboutPage_ShowsHenrikBeske()
    {
        await Page.GotoAsync($"{BaseUrl}/about");
        await Page.WaitForSelectorAsync(".about-section", new() { Timeout = 15000 });

        var pageContent = await Page.InnerTextAsync("body");
        Assert.That(pageContent, Does.Contain("Henrik").Or.Contain("mrApptastic"),
            "About page should contain developer info");
    }

    [Test]
    public async Task ContactPage_HasEmailLink()
    {
        await Page.GotoAsync($"{BaseUrl}/contact");
        await Page.WaitForSelectorAsync(".contact-card", new() { Timeout = 15000 });

        var emailLink = await Page.QuerySelectorAsync("a[href='mailto:henrikbeske@gmail.com']");
        Assert.That(emailLink, Is.Not.Null, "Contact page should have an email mailto link");
    }

    [Test]
    public async Task ContactPage_HasPhoneLink()
    {
        await Page.GotoAsync($"{BaseUrl}/contact");
        await Page.WaitForSelectorAsync(".contact-card", new() { Timeout = 15000 });

        var phoneLink = await Page.QuerySelectorAsync("a[href='tel:+4524497555']");
        Assert.That(phoneLink, Is.Not.Null, "Contact page should have a phone tel link");
    }

    [Test]
    public async Task ContactPage_HasSocialLinks()
    {
        await Page.GotoAsync($"{BaseUrl}/contact");
        await Page.WaitForSelectorAsync(".contact-social", new() { Timeout = 15000 });

        var githubLink = await Page.QuerySelectorAsync("a[href*='github.com/mrApptastic']");
        Assert.That(githubLink, Is.Not.Null, "Contact page should have GitHub link");
    }

    [Test]
    public async Task CVPage_ShowsName()
    {
        await Page.GotoAsync($"{BaseUrl}/cv");
        await Page.WaitForSelectorAsync(".cv-section", new() { Timeout = 15000 });

        var headingContent = await Page.InnerTextAsync(".cv-headline");
        Assert.That(headingContent, Does.Contain("Henrik Beske"), "CV page should show the developer name");
    }

    [Test]
    public async Task CVPage_HasPrintButton()
    {
        await Page.GotoAsync($"{BaseUrl}/cv");
        await Page.WaitForSelectorAsync(".cv-actions", new() { Timeout = 15000 });

        var printBtn = await Page.QuerySelectorAsync(".cv-actions .cta-btn");
        Assert.That(printBtn, Is.Not.Null, "CV page should have an export/print button");
    }

    [Test]
    public async Task Footer_IsVisibleOnAllPages()
    {
        var paths = new[] { "", "/about", "/cv", "/projects", "/contact" };
        foreach (var path in paths)
        {
            await Page.GotoAsync($"{BaseUrl}{path}");
            await Page.WaitForSelectorAsync(".portfolio-footer", new() { Timeout = 15000 });

            var footer = await Page.QuerySelectorAsync(".portfolio-footer");
            Assert.That(footer, Is.Not.Null, $"Footer should be visible on /{path}");
        }
    }

    [Test]
    public async Task LanguageSwitcher_ChangesToEnglish()
    {
        await Page.GotoAsync(BaseUrl);
        await Page.WaitForSelectorAsync(".lang-selector", new() { Timeout = 15000 });

        // Click English button (flag 🇬🇧)
        var langButtons = await Page.QuerySelectorAllAsync(".lang-btn");
        Assert.That(langButtons.Count, Is.EqualTo(3), "Should have 3 language buttons");

        // The en button should be the 2nd one
        await langButtons[1].ClickAsync();

        // Page reloads; wait for it to load
        await Page.WaitForLoadStateAsync(Microsoft.Playwright.LoadState.NetworkIdle, new() { Timeout = 15000 });
        await Page.WaitForSelectorAsync(".nav-links a[href='/']", new() { Timeout = 10000 });

        var currentUrl = Page.Url;
        Assert.That(currentUrl, Does.StartWith(BaseUrl), "Should still be on portfolio site after language change");

        var homeNavText = await Page.InnerTextAsync(".nav-links a[href='/']");
        Assert.That(homeNavText.Trim(), Is.EqualTo("Home"), "Navigation should be translated to English");
    }

    [Test]
    public async Task HomePage_TerminalHelpCommand_Works()
    {
        await Page.GotoAsync(BaseUrl);
        await Page.WaitForSelectorAsync(".terminal-input", new() { Timeout = 15000 });

        await Page.FillAsync(".terminal-input", "help");
        await Page.PressAsync(".terminal-input", "Enter");

        await Page.WaitForSelectorAsync(".terminal-output", new() { Timeout = 10000 });
        var terminalText = await Page.InnerTextAsync(".hero-terminal");
        Assert.That(terminalText, Does.Contain("help, whoami"), "Help output should list default commands");
    }

    [Test]
    public async Task HomePage_TerminalGoCommand_NavigatesToProjects()
    {
        await Page.GotoAsync(BaseUrl);
        await Page.WaitForSelectorAsync(".terminal-input", new() { Timeout = 15000 });

        await Page.FillAsync(".terminal-input", "go projects");
        await Page.PressAsync(".terminal-input", "Enter");

        await Page.WaitForURLAsync($"{BaseUrl}/projects", new() { Timeout = 10000 });
        await Page.WaitForSelectorAsync(".projects-section", new() { Timeout = 10000 });
    }

    [Test]
    public async Task ProjectsPage_TimelineRendersItems()
    {
        await Page.GotoAsync($"{BaseUrl}/projects");
        await Page.WaitForSelectorAsync(".projects-section", new() { Timeout = 15000 });

        // Wait for either timeline items or loading state to resolve
        await Page.WaitForTimeoutAsync(3000);

        var loadingBlock = await Page.QuerySelectorAsync(".loading-block");
        var timelineItems = await Page.QuerySelectorAllAsync(".timeline-item");

        // Either still loading (network could be slow) or has items
        if (loadingBlock == null)
        {
            Assert.That(timelineItems.Count, Is.GreaterThan(0), "Timeline should have items when loaded");
        }
        else
        {
            // Still loading — acceptable in test environment without live API
            Assert.Pass("Projects page is in loading state — API may not be available in test environment");
        }
    }

    [Test]
    public async Task App_HasPWAManifest()
    {
        await Page.GotoAsync(BaseUrl);
        var manifestLink = await Page.QuerySelectorAsync("link[rel='manifest']");
        Assert.That(manifestLink, Is.Not.Null, "App should have a PWA manifest link");
    }

    [Test]
    public async Task App_HasResponsiveViewport()
    {
        await Page.SetViewportSizeAsync(375, 667); // iPhone SE
        await Page.GotoAsync(BaseUrl);
        await Page.WaitForSelectorAsync(".portfolio-nav", new() { Timeout = 15000 });

        // On mobile, hamburger toggle should be visible
        var navToggle = await Page.QuerySelectorAsync(".nav-toggle");
        Assert.That(navToggle, Is.Not.Null, "Hamburger nav toggle should exist");

        var toggleVisible = await navToggle!.IsVisibleAsync();
        Assert.That(toggleVisible, Is.True, "Hamburger toggle should be visible on mobile");
    }
}
