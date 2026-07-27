namespace OpticPOS.Models
{
    public class Prescription
    {
        public string RightSph { get; set; } = string.Empty;
        public string RightCyl { get; set; } = string.Empty;
        public string RightAxis { get; set; } = string.Empty;
        public string RightAdd { get; set; } = string.Empty;

        public string LeftSph { get; set; } = string.Empty;
        public string LeftCyl { get; set; } = string.Empty;
        public string LeftAxis { get; set; } = string.Empty;
        public string LeftAdd { get; set; } = string.Empty;

        public string Pd { get; set; } = string.Empty;
        public string NearPd { get; set; } = string.Empty;
        
        public string Prism { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}
