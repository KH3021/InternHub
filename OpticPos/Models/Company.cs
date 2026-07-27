using SQLite;
using System.ComponentModel.DataAnnotations.Schema;
using TableAttribute = SQLite.TableAttribute;
using ColumnAttribute = SQLite.ColumnAttribute;

namespace OpticPOS.Models
{
    [Table("Companies")]
    public class Company
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        
        public string Name { get; set; } = string.Empty;
        
        public string LogoUrl { get; set; } = string.Empty;
    }
}
