namespace server.Models
{
    public class Tenant
    {
        public int Id { get; set; }
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string RoomType { get; set; } = "";
        public double RentPaid { get; set; }
        public string? DateRentWasPaid { get; set; }
        public double PowerPaid { get; set; }
        public string? DatePowerWasPaid { get; set; }
        public double WaterPaid { get; set; }
        public string? DateWaterWasPaid { get; set; }
        public double RentBalance { get; set; }
        public double PowerBalance { get; set; }
        public double WaterBalance { get; set; }
        public string DateJoined { get; set; } = "";
    }

    public class RoomPrice
    {
        public double Rent { get; set; }
        public double Power { get; set; }
        public double Water { get; set; }
    }

    public static class RoomPricing
    {
        public static Dictionary<string, RoomPrice> Prices = new()
        {
            { "twin", new RoomPrice { Rent = 3000, Power = 2000, Water = 1000 } },
            { "cluster", new RoomPrice { Rent = 4000, Power = 3000, Water = 2000 } },
            { "studio", new RoomPrice { Rent = 5000, Power = 4000, Water = 3000 } },
            { "priemum", new RoomPrice { Rent = 6000, Power = 5000, Water = 4000 } }
        };
    }

    public class AuthDto
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string RoomType { get; set; } = "";
    }

    public class PaymentDto
    {
        public string Email { get; set; } = "";
        public string BillType { get; set; } = "";
        public double AmountPaid { get; set; }
    }
}