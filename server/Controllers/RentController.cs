using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RentController : ControllerBase
{
    private readonly JsonFileService _jsonService;

    public RentController(JsonFileService jsonService)
    {
        _jsonService = jsonService;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] AuthDto dto)
    {
        var tenants = _jsonService.GetTenants();
        if (tenants.Any(t => t.Email.Equals(dto.Email, StringComparison.OrdinalIgnoreCase)))
        {
            return BadRequest(new { message = "Email is already registered." });
        }

        if (!RoomPricing.Prices.ContainsKey(dto.RoomType))
        {
            return BadRequest(new { message = "Invalid room type selected. Choose twin, cluster, studio, or priemum." });
        }

        // Auto-increment ID based on existing records
        int newId = tenants.Any() ? tenants.Max(t => t.Id) + 1 : 1;

        var newTenant = new Tenant
        {
            Id = newId,
            Email = dto.Email,
            Password = dto.Password,
            RoomType = dto.RoomType.ToLower(),
            DateJoined = DateTime.UtcNow.ToString("yyyy-MM-dd")
        };

        tenants.Add(newTenant);
        _jsonService.SaveTenants(tenants);

        return Ok(new { message = "Account created successfully!", tenant = newTenant });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] AuthDto dto)
    {
        var tenants = _jsonService.GetTenants();
        var tenant = tenants.FirstOrDefault(t => 
            t.Email.Equals(dto.Email, StringComparison.OrdinalIgnoreCase) && 
            t.Password == dto.Password);

        if (tenant == null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        return Ok(tenant);
    }

    [HttpPost("pay")]
    public IActionResult PayBill([FromBody] PaymentDto dto)
    {
        var tenants = _jsonService.GetTenants();
        var tenant = tenants.FirstOrDefault(t => t.Email.Equals(dto.Email, StringComparison.OrdinalIgnoreCase));

        if (tenant == null)
        {
            return NotFound(new { message = "Tenant not found." });
        }

        // Fetch standard pricing for their room type
        if (!RoomPricing.Prices.TryGetValue(tenant.RoomType, out var pricing))
        {
            return BadRequest(new { message = "Invalid room type configuration." });
        }

        string currentDate = DateTime.UtcNow.ToString("yyyy-MM-dd");

        switch (dto.BillType.ToLower())
        {
            case "rent":
                tenant.RentPaid += dto.AmountPaid;
                tenant.DateRentWasPaid = currentDate;
                double expectedRent = pricing.Rent + tenant.RentBalance;
                if (tenant.RentPaid < expectedRent)
                {
                    tenant.RentBalance = expectedRent - tenant.RentPaid;
                }
                else
                {
                    tenant.RentBalance = 0;
                }
                break;

            case "power":
                tenant.PowerPaid += dto.AmountPaid;
                tenant.DatePowerWasPaid = currentDate;
                double expectedPower = pricing.Power + tenant.PowerBalance;
                if (tenant.PowerPaid < expectedPower)
                {
                    tenant.PowerBalance = expectedPower - tenant.PowerPaid;
                }
                else
                {
                    tenant.PowerBalance = 0;
                }
                break;

            case "water":
                tenant.WaterPaid += dto.AmountPaid;
                tenant.DateWaterWasPaid = currentDate;
                double expectedWater = pricing.Water + tenant.WaterBalance;
                if (tenant.WaterPaid < expectedWater)
                {
                    tenant.WaterBalance = expectedWater - tenant.WaterPaid;
                }
                else
                {
                    tenant.WaterBalance = 0;
                }
                break;

            default:
                return BadRequest(new { message = "Invalid bill type. Specify rent, power, or water." });
        }

        _jsonService.SaveTenants(tenants);
        return Ok(tenant);
    }

    [HttpGet("pricing")]
    public IActionResult GetPricing()
    {
        var pricingInfo = RoomPricing.Prices.ToDictionary(
            p => p.Key,
            p => new { Rent = p.Value.Rent, Power = p.Value.Power, Water = p.Value.Water }
        );
        return Ok(pricingInfo);
    }
}