using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace asd123.Model
{
  public class BaseSchema
  {
    public Guid Id { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public BaseSchema()
    {
      Id = Ultil.uuid_v7.UUID();
      CreatedAt = DateTime.Now;
      UpdatedAt = DateTime.Now;
    }
  }
}
