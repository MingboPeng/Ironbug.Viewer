using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureWebHostDefaults(webBuilder =>
    {
        webBuilder.Configure(app =>
        {
            //ironbug-viewer\dist
            //var dir = Directory.GetCurrentDirectory();
            //var projDir = dir.Substring(0, dir.IndexOf("StaticWebServer"));
            //var contentRootPath = Path.Combine(projDir, "ironbug-viewer", "dist");
            ////var contentRootPath = Path.Combine(dir, "build"); // Adjust if your build folder is different
            //Console.WriteLine($"Hosting dir: {contentRootPath}");
            //app.UseStaticFiles(new StaticFileOptions
            //{
            //    FileProvider = new PhysicalFileProvider(contentRootPath)
            //});

            app.UseStaticFiles();

            // Optionally, add a default route to serve the index.html file
            app.UseDefaultFiles();
        });
    })
    .Build();

await host.RunAsync();
