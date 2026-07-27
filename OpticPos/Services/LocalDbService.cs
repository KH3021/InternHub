using SQLite;
using OpticPOS.Models;
using Microsoft.Maui.Storage;

namespace OpticPOS.Services
{
    public class LocalDbService
    {
        private SQLiteAsyncConnection _db;

        public LocalDbService()
        {
        }

        public async Task Init()
        {
            if (_db != null)
                return;

            var databasePath = Path.Combine(FileSystem.AppDataDirectory, "OpticPOS.db3");

            _db = new SQLiteAsyncConnection(databasePath);

            await _db.CreateTableAsync<Company>();
            await _db.CreateTableAsync<Product>();
            await _db.CreateTableAsync<Order>();

            await SeedDataAsync();
        }

        private async Task SeedDataAsync()
        {
            var companyCount = await _db.Table<Company>().CountAsync();
            if (companyCount == 0)
            {
                var companies = new List<Company>
                {
                    new Company { Name = "Essilor India Pvt. Ltd.", LogoUrl = "C" },
                    new Company { Name = "Zeiss Vision", LogoUrl = "Z" },
                    new Company { Name = "Hoya Lens India", LogoUrl = "H" },
                    new Company { Name = "Kodak Lens", LogoUrl = "K" },
                    new Company { Name = "Crizal Lenses", LogoUrl = "C" },
                    new Company { Name = "Rodenstock", LogoUrl = "R" }
                };

                await _db.InsertAllAsync(companies);

                var products = new List<Product>();
                // Generate some products for each company
                foreach (var company in await _db.Table<Company>().ToListAsync())
                {
                    products.Add(new Product { CompanyId = company.Id, Name = "1.56 HMC Blue Cut", Index = "1.56", Coating = "HMC", Type = "SV", Price = 2200 });
                    products.Add(new Product { CompanyId = company.Id, Name = "1.61 HMC", Index = "1.61", Coating = "HMC", Type = "SV", Price = 3500 });
                    products.Add(new Product { CompanyId = company.Id, Name = "1.50 SHMC", Index = "1.50", Coating = "SHMC", Type = "SV", Price = 1800 });
                    products.Add(new Product { CompanyId = company.Id, Name = "1.67 HMC Photochromic", Index = "1.67", Coating = "HMC", Type = "SV", Price = 6000 });
                }

                await _db.InsertAllAsync(products);
            }
        }

        public async Task<List<Company>> GetCompaniesAsync()
        {
            await Init();
            return await _db.Table<Company>().ToListAsync();
        }

        public async Task<Company> GetCompanyAsync(int id)
        {
            await Init();
            return await _db.Table<Company>().Where(c => c.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<Product>> GetProductsAsync(int companyId)
        {
            await Init();
            return await _db.Table<Product>().Where(p => p.CompanyId == companyId).ToListAsync();
        }

        public async Task<Product> GetProductAsync(int id)
        {
            await Init();
            return await _db.Table<Product>().Where(p => p.Id == id).FirstOrDefaultAsync();
        }

        public async Task SaveOrderAsync(Order order)
        {
            await Init();
            if (order.Id != 0)
            {
                await _db.UpdateAsync(order);
            }
            else
            {
                await _db.InsertAsync(order);
            }
        }
        
        public async Task<List<Order>> GetOrdersAsync()
        {
            await Init();
            return await _db.Table<Order>().OrderByDescending(o => o.Timestamp).ToListAsync();
        }
    }
}
