using SQLite;

namespace OpticPOS.Models
{
    [Table("Products")]
    public class Product
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        
        [Indexed]
        public int CompanyId { get; set; }
        
        public string Name { get; set; } = string.Empty;
        
        public string Index { get; set; } = string.Empty;
        
        public string Coating { get; set; } = string.Empty;
        
        public string Type { get; set; } = string.Empty;
        
        public decimal Price { get; set; }
    }
}
