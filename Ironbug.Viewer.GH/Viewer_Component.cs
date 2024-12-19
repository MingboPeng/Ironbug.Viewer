using Grasshopper;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Data;
using Grasshopper.Kernel.Types;
using IronbugViewer.GH;
using PollinationBrowserControl;
using Rhino;
using Rhino.Geometry;
using System;
using System.Collections.Generic;

namespace IronbugViewer.GH
{
    public class Viewer_Component : GH_Component
    {
        /// <summary>
        /// Each implementation of GH_Component must provide a public 
        /// constructor without any arguments.
        /// Category represents the Tab in which the component will appear, 
        /// Subcategory the panel. If you use non-existing tab or panel names, 
        /// new tabs/panels will automatically be created.
        /// </summary>
        public Viewer_Component()
          : base("IB_Viewer (WIP)", "Viewer (WIP)",
            "Ironbug viewer for visualizing HVAC loops.",
             "Ironbug", "HVAC")
        {
        }

        /// <summary>
        /// Registers all the input parameters for this component.
        /// </summary>
        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
            pManager[pManager.AddBooleanParameter("HVAC System", "hvac", "An Ironbug HVAC system.", GH_ParamAccess.list)].DataMapping = GH_DataMapping.Flatten;
        }

        /// <summary>
        /// Registers all the output parameters for this component.
        /// </summary>
        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
        }

        private static ViewerDialog _viewer;
        /// <summary>
        /// This is the method that actually does the work.
        /// </summary>
        /// <param name="DA">The DA object can be used to retrieve data from input parameters and 
        /// to store data in output parameters.</param>
        protected override void SolveInstance(IGH_DataAccess DA)
        {
            //var tree = new GH_Structure<IGH_Goo>();
            var inputSys = new List<object>();
            if(!DA.GetDataList(0, inputSys)) return;

            var hostParent = RhinoApp.MainWindowHandle();
            _viewer = ViewerDialog.Init();
            _viewer.MessageReceived += (s, e) => RhinoApp.WriteLine(s);

            // show or active the existing dialog
            _viewer.ShowWindow();

        }

        /// <summary>
        /// Provides an Icon for every component that will be visible in the User Interface.
        /// Icons need to be 24x24 pixels.
        /// You can add image files to your project resources and access them like this:
        /// return Resources.IconForThisComponent;
        /// </summary>
        protected override System.Drawing.Bitmap Icon => null;

        /// <summary>
        /// Each component must have a unique Guid to identify it. 
        /// It is vital this Guid doesn't change otherwise old ghx files 
        /// that use the old ID will partially fail during loading.
        /// </summary>
        public override Guid ComponentGuid => new Guid("e1b9ae6c-fa38-4388-9875-d21ebb0cde18");
    }
}