# Specify the port for the Python server
$port = 8000

# Start Python server in the background
$serverProcess = Start-Process python.exe -ArgumentList "-m", "http.server", $port -PassThru -WindowStyle Hidden

# Wait for a moment to ensure the server has started
Start-Sleep -Seconds 2

# Open default web browser to the server's address
Start-Process "http://localhost:$port"

# Wait for the user to close the PowerShell window
Write-Host "Press Enter to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown").Key

# Stop the Python server process
Stop-Process -Id $serverProcess.Id -Force
