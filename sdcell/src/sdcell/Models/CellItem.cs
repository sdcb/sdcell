using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sdcell
{
    public struct CellItem : IEquatable<CellItem>, IEqualityComparer<CellItem>
    {
        public Guid Id;

        public string Name;

        public float R;

        public Point Position;

        [JsonIgnore]
        public float Speed
        {
            get
            {
                return 3 / (float)Math.Log10(R);
            }
        }

        [JsonIgnore]
        public float Mass
        {
            get { return R * R; }
            set { R = (float)Math.Sqrt(value); }
        }

        static readonly Random r = new Random();

        public static CellItem CreateRandom(Point size)
        {
            return new CellItem
            {
                Id = Guid.NewGuid(), 
                R = 10,
                Position = new Point(
                    r.Next(-(int)size.X / 2, (int)size.X / 2), 
                    r.Next(-(int)size.Y / 2, (int)size.Y / 2))
            };
        }

        public static CellItem Create(float r, Point position)
        {
            return new CellItem
            {
                R = r,
                Position = position
            };
        }

        public bool Equals(CellItem other)
        {
            return Id == other.Id &&
                Mass == other.Mass &&
                Position.Equals(other.Position);
        }

        public bool Equals(CellItem x, CellItem y)
        {
            return x.Equals(y);
        }

        public int GetHashCode(CellItem obj)
        {
            return obj.Id.GetHashCode() ^
                obj.Mass.GetHashCode() ^
                obj.Position.GetHashCode();
        }
    }
}
