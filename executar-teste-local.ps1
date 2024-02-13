# Use este script para executar testes locais

$RESULTS_WORKSPACE = "$(Get-Location)\load-test\user-files\results"
$GATLING_BIN_DIR = "$(Get-Location)\gatling\bin"
$GATLING_WORKSPACE = "$(Get-Location)\load-test\user-files"

function Run-Gatling {
    & "$GATLING_BIN_DIR\gatling.bat" -rm local -s RinhaBackendCrebitosSimulation `
        -rd "Rinha de Backend - 2024/Q1: Crébito" `
        -rf $RESULTS_WORKSPACE `
        -sf "$GATLING_WORKSPACE/simulations"
}

function Start-Test {
    Write-Host "Starting test..."
    Write-Host $GATLING_BIN_DIR
    Run-Gatling
}

Start-Test