' Laiko žemėlapis — paleidžia programėlę šiame kompiuteryje.
' Paleidžia paslėptą vietinį serverį (jei jis dar neveikia) ir atidaro naršyklę.
' Veikiant kompiuteryje rodomi ir tie senieji žemėlapiai, kuriuos leidžiama naudoti tik asmeniškai.
Option Explicit
Dim sh, fso, dir, port, url
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
port = "8777"
url = "http://localhost:" & port & "/"

' Window style 0 = hidden. (pythonw cannot be used: http.server logs to stderr, which pythonw lacks.)
' If the port is already taken (server already running), the new python exits by itself.
sh.Run "python -m http.server " & port & " --bind 127.0.0.1 --directory """ & dir & """", 0, False
WScript.Sleep 900
sh.Run url
