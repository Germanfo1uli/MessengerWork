using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class FileUploader: IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var formParameters = context.MethodInfo.GetParameters()
            .Where(p => p.GetCustomAttributes(typeof(FromFormAttribute), false).Any())
            .ToList();

        if (formParameters.Any())
        {
            operation.RequestBody = new OpenApiRequestBody
            {
                Content =
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties = formParameters.ToDictionary(
                                p => p.Name,
                                p =>
                                {
                                    if (p.ParameterType == typeof(IFormFile))
                                        return new OpenApiSchema { Type = "string", Format = "binary" };
                                    else
                                        return new OpenApiSchema { Type = "string" }; 
                                }
                            ),
                            Required = formParameters
                                .Where(p => !p.HasDefaultValue)
                                .Select(p => p.Name)
                                .ToHashSet()
                        }
                    }
                }
            };
        }
    }
}