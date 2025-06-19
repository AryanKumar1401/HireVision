## USE THIS SCRIPT IF RUNNING ON WINDOWS!!!

# Start backend
Set-Location backend
& .\venv\Scripts\Activate.ps1
Start-Process python -ArgumentList "main.py" -NoNewWindow
$backendProcess = Get-Process python | Where-Object {$_.MainWindowTitle -eq ""} | Select-Object -Last 1

# Start frontend
Set-Location ..\frontend
Start-Process npm -ArgumentList "run dev" -NoNewWindow
$frontendProcess = Get-Process node | Select-Object -Last 1

Write-Host "Both backend and frontend are starting..."
Write-Host "Press Ctrl+C to stop both processes"

try {
    # Wait for user to press Ctrl+C
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    # Cleanup function
    if ($backendProcess) {
        Stop-Process -Id $backendProcess.Id -Force
        Write-Host "Backend stopped"
    }
    if ($frontendProcess) {
        Stop-Process -Id $frontendProcess.Id -Force
        Write-Host "Frontend stopped"
    }
    Write-Host "All processes stopped"
} 