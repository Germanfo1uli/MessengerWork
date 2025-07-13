using CosmoBack.CosmoDBContext;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

if(builder.Environment.IsDevelopment()) 
{
    builder.Services.AddHttpClient("NoSSL").ConfigurePrimaryHttpMessageHandler(() =>
        new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (_, _, _, _) => true
        });
}


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<CosmoDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<CosmoDbContext>();
        dbContext.Database.Migrate();
    }
}

app.UseHttpsRedirection();

app.Run();

