using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using sdcell.Business;
using Microsoft.AspNetCore.Mvc;

namespace sdcell.Controllers
{
    public class CellController : Controller
    {
        private readonly CellManager _cellManager;

        public CellController(CellManager cellManager)
        {
            _cellManager = cellManager;
        }

        public IEnumerable<CellItem> All()
        {
            return _cellManager.All();
        }

        public IEnumerable<CellItem> New(int id)
        {
            var list = new List<CellItem>();
            for (var i = 0; i < id; ++i)
            {
                list.Add(_cellManager.CreateNewAndPush(small: true));
            }
            return list;
        }

        public bool Clear()
        {
            _cellManager.Clear();
            return true;
        }
    }
}
