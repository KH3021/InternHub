using SQLite;

namespace OpticPOS.Models
{
    public class QualityTier
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string BadgeColor { get; set; } = string.Empty;
    }
}
