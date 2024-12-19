using Grasshopper;
using Grasshopper.Kernel;
using System;
using System.Drawing;

namespace IronbugViewer.GH
{
    public class Ironbug_Viewer_GHInfo : GH_AssemblyInfo
    {
        public override string Name => "Ironbug.Viewer.GH";

        //Return a 24x24 pixel bitmap to represent this GHA library.
        public override Bitmap Icon => null;

        //Return a short string describing the purpose of this GHA library.
        public override string Description => "Ironbug viewer for visualizing HVAC loops";

        public override Guid Id => new Guid("ef5e841a-e672-431d-b762-e57d5cce70ac");

        //Return a string identifying you or your company.
        public override string AuthorName => "Mingbo Peng";

        //Return a string representing your preferred contact details.
        public override string AuthorContact => "Mingbo@alumni.upenn.edu";

        //Return a string representing the version.  This returns the same version as the assembly.
        public override string AssemblyVersion => GetType().Assembly.GetName().Version.ToString();
    }
}