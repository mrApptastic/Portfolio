# Portfolio

Personal portfolio site for Henrik Beske, built with **Blazor WebAssembly**.

## Tech stack

- .NET 10
- Blazor WebAssembly
- GitHub Pages (GitHub Actions deployment)

## Run locally

```bash
dotnet restore
dotnet run --project Portfolio.App
```

Open: `http://localhost:5000` (or the URL shown in the console).

## Deploy

Deployment is automated through [deploy.yml](./.github/workflows/deploy.yml) and runs on pushes to `main`.

The workflow publishes the app and deploys `publish/wwwroot` to GitHub Pages.
