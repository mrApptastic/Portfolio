# Portfolio

Personal portfolio site for Henrik Beske, built with **Blazor WebAssembly**.

## Tech stack

- .NET 10
- Blazor WebAssembly
- GitHub Pages (GitHub Actions deployment)

## Run locally

```bash
dotnet restore
dotnet watch --project ./Portfolio.App/Portfolio.App.csproj --launch-profile https
```

Open: `https://localhost:7185` (or the URL shown in the console).

## Deploy

Deployment is automated through [deploy.yml](./.github/workflows/deploy.yml) and runs on pushes to `master`.

The workflow publishes the app and deploys `publish/wwwroot` to GitHub Pages.
