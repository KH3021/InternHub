using OpticPOS.Models;
using System.Text;

namespace OpticPOS.Services
{
    public class WhatsAppMessageBuilder
    {
        public string BuildOrderMessage(Order order, Prescription rx, Company company, Product product, List<string> features)
        {
            var sb = new StringBuilder();
            
            sb.AppendLine($"*NEW ORDER: {order.OrderId}*");
            sb.AppendLine($"Date: {order.Timestamp.ToString("dd MMM yyyy, hh:mm tt")}");
            sb.AppendLine();
            
            sb.AppendLine($"*Lens Type:* {order.LensType}");
            sb.AppendLine($"*Quality Tier:* {order.QualityTier}");
            sb.AppendLine($"*Company:* {company?.Name}");
            if (product != null)
            {
                sb.AppendLine($"*Product:* {product.Name}");
                sb.AppendLine($"*Index:* {product.Index}");
                sb.AppendLine($"*Coating:* {product.Coating}");
            }
            
            if (features != null && features.Any())
            {
                sb.AppendLine($"*Features:* {string.Join(", ", features)}");
            }
            sb.AppendLine();
            
            sb.AppendLine("*PRESCRIPTION:*");
            sb.AppendLine("OD (Right):");
            sb.AppendLine($"SPH: {rx.RightSph} | CYL: {rx.RightCyl} | AXIS: {rx.RightAxis} | ADD: {rx.RightAdd}");
            sb.AppendLine("OS (Left):");
            sb.AppendLine($"SPH: {rx.LeftSph} | CYL: {rx.LeftCyl} | AXIS: {rx.LeftAxis} | ADD: {rx.LeftAdd}");
            
            sb.AppendLine();
            sb.AppendLine($"*PD:* {rx.Pd} mm");
            if (!string.IsNullOrWhiteSpace(rx.NearPd))
                sb.AppendLine($"*Near PD:* {rx.NearPd} mm");
                
            if (!string.IsNullOrWhiteSpace(rx.Prism))
                sb.AppendLine($"*Prism:* {rx.Prism}");
                
            if (!string.IsNullOrWhiteSpace(rx.Notes))
                sb.AppendLine($"*Notes:* {rx.Notes}");
                
            sb.AppendLine();
            sb.AppendLine($"*Quantity:* {order.Quantity} Pair(s)");
            sb.AppendLine();
            sb.AppendLine("Please confirm receipt of this order.");
            
            return sb.ToString();
        }
    }
}
