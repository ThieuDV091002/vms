FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER root
WORKDIR /app
EXPOSE 8080
EXPOSE 8081



FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["NuGet.Config", "."]
COPY ["src/Molex.UFE.HttpApi.Host/Molex.UFE.HttpApi.Host.csproj", "src/Molex.UFE.HttpApi.Host/"]
COPY ["src/Molex.UFE.Application/Molex.UFE.Application.csproj", "src/Molex.UFE.Application/"]
COPY ["src/Molex.UFE.Domain/Molex.UFE.Domain.csproj", "src/Molex.UFE.Domain/"]
COPY ["src/Molex.UFE.Domain.Shared/Molex.UFE.Domain.Shared.csproj", "src/Molex.UFE.Domain.Shared/"]
COPY ["src/Molex.UFE.Application.Contracts/Molex.UFE.Application.Contracts.csproj", "src/Molex.UFE.Application.Contracts/"]
COPY ["src/Molex.UFE.DbMigrator/Molex.UFE.DbMigrator.csproj", "src/Molex.UFE.DbMigrator/"]
COPY ["src/Molex.UFE.EntityFrameworkCore/Molex.UFE.EntityFrameworkCore.csproj", "src/Molex.UFE.EntityFrameworkCore/"]
COPY ["src/Molex.UFE.HttpApi/Molex.UFE.HttpApi.csproj", "src/Molex.UFE.HttpApi/"]
RUN dotnet restore "./src/Molex.UFE.HttpApi.Host/Molex.UFE.HttpApi.Host.csproj"
COPY . .
# Build Molex.UFE.DbMigrator
WORKDIR "/src/src/Molex.UFE.DbMigrator"
RUN dotnet build "./Molex.UFE.DbMigrator.csproj" -c $BUILD_CONFIGURATION -o /app/dbmigrator
# Build Molex.UFE.HttpApi.Host
WORKDIR "/src/src/Molex.UFE.HttpApi.Host"
RUN dotnet build "./Molex.UFE.HttpApi.Host.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Molex.UFE.HttpApi.Host.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false


FROM base AS final
ENV Version=1.0.0
WORKDIR /app
COPY --from=build /app/dbmigrator ./dbmigrator
COPY --from=publish /app/publish .
ENTRYPOINT ["sh", "-c", "cp /app/appsettings.json /app/dbmigrator/appsettings.json && if [ \"$DBMigration\" = \"true\" ]; then dotnet /app/dbmigrator/Molex.UFE.DbMigrator.dll & fi && dotnet /app/Molex.UFE.HttpApi.Host.dll"]
