using System;
using System.Globalization;
using System.IO;
using System.Text;

class Program
{
    static void Main(string[] args)
    {
        const string fbeName = "fbe.exe";
        const int ts_offset = 0x139200;
        const int ver_offset = 0x139237;

        if (args.Length > 0 && Version.TryParse(args[0], out Version ver) && File.Exists(fbeName))
        {
            try
            {
                var date = DateTime.Now.ToString("MMM dd yyyy");
                var time = DateTime.Now.ToString("HH:mm:ss");
                var timestamp = Encoding.ASCII.GetBytes($"{date} {time}");
                var version = Encoding.ASCII.GetBytes($"{ver.Major}.{ver.Minor}.{ver.Build}");
                using (var fileStream = new FileStream(fbeName, FileMode.Open, FileAccess.ReadWrite))
                {
                    fileStream.Seek(ts_offset, SeekOrigin.Begin);
                    fileStream.Write(timestamp, 0, timestamp.Length);
                    fileStream.Seek(ver_offset, SeekOrigin.Begin);
                    fileStream.Write(version, 0, version.Length);
                    Console.WriteLine("FBE build timestamp updated");
                }
            }
            catch (IOException ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
            }
        }
        else Console.WriteLine("Use: update_fbe.exe [release_number]");
    }
}
