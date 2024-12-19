using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;

namespace IronbugViewer.GH
{
    internal class Host
    {

        private static Process _instance { get; set; }
        public static void Start( string port = "8173")
        {
            //"D:\\Dev\\Ironbug.Viewer\\ironbug-viewer\\dist";
            var wwwroot = Path.Combine(Path.GetDirectoryName(typeof(Host).Assembly.Location), "wwwroot");

            if (!System.IO.Directory.Exists(wwwroot))
                throw new ArgumentException("Invalid wwwroot:"+ wwwroot);

            var python = System.IO.Path.Combine("C:\\Program Files\\ladybug_tools\\python", "python");
            var args = $"-m http.server {port} --directory \"{wwwroot}\"";
            ExeCommand(python, args);
        }

        public static void Close()
        {
            if (_instance == null) return;

            if (!_instance.HasExited) 
                _instance.Kill();
        }

        public static void ExeCommand(string program, string argument)
        {
            var cmd = $"Command:\n{program} {argument}";

            //results = string.Empty;
            var stdout = new List<string>();
            var stdErr = new List<string>();

            var startInfo = new ProcessStartInfo 
            { 
                FileName = program, 
                Arguments = argument, 
                RedirectStandardOutput = true, 
                RedirectStandardError = true, 
                UseShellExecute = false, 
                CreateNoWindow = true 
            }; 

            var process = new Process { StartInfo = startInfo };
            process.ErrorDataReceived += (s, m) => { if (m.Data != null) stdErr.Add(m.Data); };
            process.OutputDataReceived += (s, m) => { if (m.Data != null) stdout.Add(m.Data); };

            process.Start();
            process.BeginErrorReadLine();
            process.BeginOutputReadLine();

            _instance = process;
        }



    }
}
