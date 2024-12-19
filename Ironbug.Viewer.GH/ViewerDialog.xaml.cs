using PollinationBrowserControl;
using System.Windows.Input;

namespace IronbugViewer.GH
{
    public partial class ViewerDialog
    {
        private static ViewerDialog _instance;
        public event BrowserControl.CoreWebView2WebMessageReceivedEventHandler MessageReceived;

        private object _parentUI;


        public ViewerDialog(string url, object parentUI = default, string webView2TempDir = default)
        {
            InitializeComponent();
            DataContext = this;

            this.Title = "Ironbug Viewer (WIP)";

            this.brControl.InitEnv($"Ironbug.Viewer", url, webView2TempDir);
            this.brControl.MessageReceived += (s, e) => MessageReceived?.Invoke(s, e);

            this.Closing += ViewerDialog_Closing;
            _parentUI = parentUI;
        }

        public ViewerDialog(object parentUI = default)
            : this(string.Empty, parentUI)
        { }


        private void ViewerDialog_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            this.Closing -= ViewerDialog_Closing;
            Host.Close();
            _instance = null;
        }

        public static ViewerDialog Init(object parentUI = default)
        {
            if (_instance == null)
            {

             
                Host.Start();
                var url = @"http://localhost:8173";
                _instance = new ViewerDialog(url, parentUI);
            }
            return _instance;
        }

        public void ShowWindow()
        {

            if (!this.IsLoaded)
            {
                this.Show();
                return;
            }


            if (this.WindowState == System.Windows.WindowState.Minimized)
            {
                this.WindowState = System.Windows.WindowState.Normal;
            }

            this.Activate();

        }


    }
}