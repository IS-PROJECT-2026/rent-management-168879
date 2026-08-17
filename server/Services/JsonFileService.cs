using server.Models;
using System.Text.Json;

namespace server.Services
{
    public class JsonFileService
    {
        private readonly string _filePath = Path.Combine(Directory.GetCurrentDirectory(), "tenants.json");

        public List<Tenant> GetTenants()
        {
            if (!File.Exists(_filePath)) return new List<Tenant>();
            var json = File.ReadAllText(_filePath);
            if (string.IsNullOrWhiteSpace(json)) return new List<Tenant>();
            return JsonSerializer.Deserialize<List<Tenant>>(json) ?? new List<Tenant>();
        }

        public void SaveTenants(List<Tenant> tenants)
        {
            var json = JsonSerializer.Serialize(tenants, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, json);
        }
    }
}