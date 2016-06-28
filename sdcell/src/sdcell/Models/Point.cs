using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sdcell
{
    public struct Point : IEquatable<Point>, IEqualityComparer<Point>
    {
        public float X;
        public float Y;

        public Point(int x, int y)
        {
            X = x;
            Y = y;
        }

        public float Length()
        {
            return (float)Math.Sqrt(X * X + Y * Y);
        }

        public bool Equals(Point other)
        {
            return X == other.X && Y == other.Y;
        }

        public bool Equals(Point x, Point y)
        {
            return x.Equals(y);
        }

        public int GetHashCode(Point obj)
        {
            return X.GetHashCode() ^ Y.GetHashCode();
        }

        public static Point operator-(Point l, Point r)
        {
            return new Point
            {
                X = l.X - r.X, 
                Y = l.Y - r.Y
            };
        }

        public static Point operator +(Point l, Point r)
        {
            return new Point
            {
                X = l.X + r.X,
                Y = l.Y + r.Y
            };
        }

        public static Point operator /(Point l, float r)
        {
            return new Point
            {
                X = l.X / r,
                Y = l.Y / r
            };
        }

        public static Point operator *(Point l, float r)
        {
            return new Point
            {
                X = l.X * r,
                Y = l.Y * r
            };
        }

        public float DistanceSqrt(Point other)
        {
            return 
                (X - other.X) * (X - other.X) +
                (Y - other.Y) * (Y - other.Y);
        }
    }
}
