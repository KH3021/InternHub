using OpticPOS.Models;
using System.Text.Json;

namespace OpticPOS.Services
{
    public class OrderDraftService
    {
        private readonly LocalDbService _dbService;

        public Order CurrentOrder { get; set; } = new Order();
        public Prescription CurrentPrescription { get; set; } = new Prescription();
        public List<string> SelectedFeatures { get; set; } = new List<string>();
        
        public Company SelectedCompany { get; set; }
        public Product SelectedProduct { get; set; }

        public OrderDraftService(LocalDbService dbService)
        {
            _dbService = dbService;
            InitNewOrder();
        }

        public void InitNewOrder()
        {
            CurrentOrder = new Order
            {
                OrderId = "ORD-" + new Random().Next(1000, 9999).ToString(),
                Timestamp = DateTime.Now,
                Status = "Draft"
            };
            CurrentPrescription = new Prescription();
            SelectedFeatures = new List<string>();
            SelectedCompany = null;
            SelectedProduct = null;
        }

        public async Task SaveDraftAsync()
        {
            CurrentOrder.PrescriptionJson = JsonSerializer.Serialize(CurrentPrescription);
            CurrentOrder.SelectedFeaturesJson = JsonSerializer.Serialize(SelectedFeatures);
            CurrentOrder.CompanyId = SelectedCompany?.Id;
            CurrentOrder.ProductId = SelectedProduct?.Id;
            
            if (SelectedProduct != null)
            {
                CurrentOrder.TotalAmount = SelectedProduct.Price * CurrentOrder.Quantity;
            }

            await _dbService.SaveOrderAsync(CurrentOrder);
        }

        public async Task FinalizeOrderAsync()
        {
            CurrentOrder.Status = "Sent";
            CurrentOrder.Timestamp = DateTime.Now;
            await SaveDraftAsync();
            InitNewOrder();
        }
    }
}
