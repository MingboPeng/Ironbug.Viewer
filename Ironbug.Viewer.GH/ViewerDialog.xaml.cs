using PollinationBrowserControl;
using System.Windows.Documents;
using System.Windows.Forms;
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
            this.brControl.MessageReceived += BrControl_MessageReceived;
            this.brControl.WebView.CoreWebView2InitializationCompleted += WebView_CoreWebView2InitializationCompleted;
            this.Closing += ViewerDialog_Closing;
            _parentUI = parentUI;
        }

        private void BrControl_MessageReceived(string message, System.Action<object> returnAction)
        {
            this.brControl.MessageReceived -= BrControl_MessageReceived;
            if (message == "IBViewer loaded!")
            {
                // ready to push data and render system loops
                SchedulePost(_data);
            }
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

        public static ViewerDialog Init(string url = default, object parentUI = default)
        {
            if (_instance == null)
            {
                url = url ?? Host.Start();
                _instance = new ViewerDialog(url, parentUI);

            }
            return _instance;
        }

        private string _data;
        public void SchedulePost(string message)
        {
            if (string.IsNullOrEmpty(message))
                return;

            // isn't ready
            if (this.brControl.WebView.CoreWebView2 == null)
            {
                // keep it and wait until message "IBViewer loaded!" received
                _data = message;
            }
            else
            {
                this.brControl.PostMessage(message);
            }
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

        private void WebView_CoreWebView2InitializationCompleted(object sender, Microsoft.Web.WebView2.Core.CoreWebView2InitializationCompletedEventArgs e)
        {
            this.brControl.WebView.CoreWebView2.Settings.AreDevToolsEnabled = true;
        }

        private void WebView_NavigationCompleted(object sender, Microsoft.Web.WebView2.Core.CoreWebView2NavigationCompletedEventArgs e)
        {

            if (!string.IsNullOrEmpty(_data))
            {

                this.brControl.PostMessage(_data);
            }
            //throw new System.NotImplementedException();
        }

    }
}