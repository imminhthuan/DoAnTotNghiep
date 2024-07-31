## Build Stage: Use SDK image to build the application
#FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
#WORKDIR /src
#
## Copy and restore project dependencies
#COPY ["QuanLyDiemSinhVien.csproj", "src/"]
#RUN dotnet restore "src/QuanLyDiemSinhVien.csproj"
#
## Copy the remaining source code and build the application
#COPY . .
#WORKDIR /src
#RUN dotnet build "QuanLyDiemSinhVien.csproj" -c Release -o /app/build
#
## Publish Stage: Publish the application
#FROM build AS publish
#RUN dotnet publish "QuanLyDiemSinhVien.csproj" -c Release -o /app/publish
#
## Final Stage: Use the base image and copy the published output
#FROM mcr.microsoft.com/dotnet/aspnet:8.0
#ENV ASPNETCORE_URLS=http://*:5001
#EXPOSE 5001
#WORKDIR /app
#COPY --from=publish /app/publish .
#
## Set the entry point to run the application
#ENTRYPOINT ["dotnet", "QuanLyDiemSinhVien.dll"]



## Use the official .NET 8 SDK image as the build image
#FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
#
## Set the working directory
#WORKDIR /app
#
## Copy the project file and restore any dependencies
#COPY QuanLyDiemSinhVien.csproj ./
#RUN dotnet restore
#
## Copy the rest of the application files
#COPY . ./
#
## Build the application
#RUN dotnet publish -c Release -o out
#
## Use the official .NET 8 runtime image as the base image for the app
#FROM mcr.microsoft.com/dotnet/aspnet:8.0
#
## Set the working directory
#WORKDIR /app
#
## Copy the build output from the build stage to the runtime stage
#COPY --from=build /app/out .
#
## Expose the port the application runs on
#EXPOSE 80
#
## Set the entry point to run the application
#ENTRYPOINT ["dotnet", "QuanLyDiemSinhVien.dll"]
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

WORKDIR /app

EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

COPY . .

RUN dotnet restore "QuanLyDiemSinhVien.csproj"

RUN dotnet build "QuanLyDiemSinhVien.csproj" -c Release -o /app/build

RUN dotnet publish "QuanLyDiemSinhVien.csproj" -c Release -o /app/publish

FROM base AS final

WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "QuanLyDiemSinhVien.dll"]