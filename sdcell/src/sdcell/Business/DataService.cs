using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sdcell
{
    public class DataService
    {
        public static ConcurrentDictionary<Guid, CellItem> Cells = new ConcurrentDictionary<Guid, CellItem>();

        public IEnumerable<CellItem> GetAll()
        {
            return Cells.Values;
        }

        public CellItem GetOne(Guid id)
        {
            return Cells[id];
        }

        public void UpdateOneRP(Guid id, float r, Point p)
        {
            var cell = Cells.GetOrAdd(id, CellItem.Create(r, p));
            cell.R = r;
            cell.Position = p;
            Cells[id] = cell;
        }

        public int TruncateTable()
        {
            var count = Cells.Count;
            Cells.Clear();
            return count;
        }

        public void DeleteOne(Guid id)
        {
            CellItem item;
            Cells.TryRemove(id, out item);
        }

        public Guid AddOne(CellItem item)
        {
            return Cells.AddOrUpdate(item.Id, item, (id, newItem) => item).Id;
        }
    }
}
