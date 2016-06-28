using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using sdcell.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sdcell.Business
{
    public class CellManager
    {
        public readonly IHubContext _cellHub;
        public readonly Point Size = new Point { X = 1500, Y = 1500 };
        private readonly DataService _data;

        public CellManager(
            IConnectionManager connectionManager, 
            DataService data)
        {
            _cellHub = connectionManager.GetHubContext<CellHub>();
            _data = data;
        }

        public IEnumerable<CellItem> All()
        {
            return _data.GetAll();
        }

        public CellItem CreateNewAndPush(bool small = false)
        {
            var cell = CreateNew(Size, small);
            Push(cell.Id);
            return cell;
        }

        public int Clear()
        {
            return _data.TruncateTable();
        }

        public bool MoveToAndPush(Guid id, Point position)
        {
            var ok = MoveTo(id, position);
            if (ok)
            {
                Push(id);
            }
            return ok;
        }

        private CellItem CreateNew(Point size, bool small)
        {
            var cell = CellItem.CreateRandom(size);
            if (small)
            {
                cell.Mass /= 3;
            }
            cell.Id = _data.AddOne(cell);
            return cell;
        }

        private bool MoveTo(Guid id, Point position)
        {
            CellItem cell = _data.GetOne(id);
            bool has = cell.Id != default(Guid);
            if (has && position.Length() > 0)
            {
                Point direction = position;
                Point one = direction / direction.Length();

                CellItem cellNew = cell;
                cellNew.Position += one * cell.Speed;

                if (cellNew.Position.X > Size.X / 2 || cellNew.Position.X < -Size.X / 2)
                {
                    cellNew.Position.X = cell.Position.X;
                }

                if (cellNew.Position.Y > Size.Y / 2 || cellNew.Position.Y < -Size.Y / 2)
                {
                    cellNew.Position.Y = cell.Position.Y;
                }

                cellNew = ManageEat(cellNew);

                _data.UpdateOneRP(id, cellNew.R, cellNew.Position);
            }
            return has;
        }

        private CellItem ManageEat(CellItem cell)
        {
            var toDrops = new List<Guid>();

            foreach (var other in _data.GetAll())
            {
                if (cell.Id != other.Id && 
                    cell.Position.DistanceSqrt(other.Position) > other.R * other.R && 
                    cell.Position.DistanceSqrt(other.Position) < cell.R * cell.R)
                {
                    cell.Mass += other.Mass;
                    toDrops.Add(other.Id);
                }
            }

            foreach (var key in toDrops)
            {
                _data.DeleteOne(key);
            }

            foreach (var key in toDrops)
            {
                Drop(key);
            }

            return cell;
        }

        private bool Push(Guid id)
        {
            CellItem cell = _data.GetOne(id);
            var has = cell.Id != Guid.Empty;
            if (has)
            {
                _cellHub.Clients.All.PushCell(cell);
            }
            return has;
        }

        private bool Push(CellItem cell)
        {
            _cellHub.Clients.All.PushCell(cell);
            return true;
        }

        private void Drop(Guid id)
        {
            _cellHub.Clients.All.DeleteCell(id);
        }
    }
}
