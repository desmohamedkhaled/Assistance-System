# Use .NET 8 runtime as base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Use .NET 8 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["AssistanceManagementSystem.csproj", "."]
RUN dotnet restore "./AssistanceManagementSystem.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "AssistanceManagementSystem.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AssistanceManagementSystem.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AssistanceManagementSystem.dll"]
