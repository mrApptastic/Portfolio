namespace Portfolio.App.Models;

public class PortfolioList
{
    public List<Certificate> Certificates { get; set; } = [];
    public List<Education> Educations { get; set; } = [];
    public List<Experience> Experiences { get; set; } = [];
    public List<Interest> Interests { get; set; } = [];
    public List<Language> Languages { get; set; } = [];
    public List<Project> Projects { get; set; } = [];
    public List<Qualification> Qualifications { get; set; } = [];
}

public abstract class BaseItem
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string ImageUrl { get; set; } = "";
}

public class Certificate : BaseItem
{
    public string Place { get; set; } = "";
    public string From { get; set; } = "";
    public string To { get; set; } = "";
}

public class Education : BaseItem
{
    public string Place { get; set; } = "";
    public string From { get; set; } = "";
    public string To { get; set; } = "";
}

public class Experience : BaseItem
{
    public string Place { get; set; } = "";
    public string From { get; set; } = "";
    public string To { get; set; } = "";
}

public class Interest : BaseItem { }

public class Language : BaseItem { }

public class Project : BaseItem
{
    public string Place { get; set; } = "";
    public string From { get; set; } = "";
    public string To { get; set; } = "";
    public string DemoUrl { get; set; } = "";
    public string DocUrl { get; set; } = "";
    public string SourceUrl { get; set; } = "";
}

public class Qualification : BaseItem { }
