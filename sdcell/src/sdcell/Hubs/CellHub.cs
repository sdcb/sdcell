using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using sdcell.Business;
using Microsoft.AspNetCore.SignalR;

namespace sdcell.Hubs
{
    public class CellHub : Hub
    {
        private readonly CellManager _cellManager;

        public CellHub(CellManager cellManager)
        {
            _cellManager = cellManager;
        }

        public bool MoveTo(Guid id, Point position)
        {
            return _cellManager.MoveToAndPush(id, position);
        }

        public IEnumerable<CellItem> All()
        {
            return _cellManager.All();
        }

        public CellItem New()
        {
            return _cellManager.CreateNewAndPush();
        }

        public bool Clear()
        {
            _cellManager.Clear();
            return true;
        }
    }
}
