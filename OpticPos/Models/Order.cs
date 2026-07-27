using SQLite;
using System;
using System.Collections.Generic;

namespace OpticPOS.Models
{
    [Table("Orders")]
    public class Order
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        
        public string OrderId { get; set; } = string.Empty; // ORD-####
        
        public DateTime Timestamp { get; set; }
        
        public string Status { get; set; } = "Draft"; // Draft, Sent
        
        // Storing Prescription as JSON string in SQLite to keep it simple
        public string PrescriptionJson { get; set; } = string.Empty;
        
        public string LensType { get; set; } = string.Empty;
        
        public string QualityTier { get; set; } = string.Empty;
        
        public string SelectedFeaturesJson { get; set; } = "[]";
        
        public int? CompanyId { get; set; }
        
        public int? ProductId { get; set; }
        
        public int Quantity { get; set; } = 1;
        
        public decimal TotalAmount { get; set; }
    }
}
