# Descritpion

Web App that allows you to modify certain properties of OS configuration files & generate the nescessary files.

# How To Run

## Ensuring suitable execution policy

1. Run powershell as Admin
2. Change execution policy to remote signed
   `Set-ExecutionPolicy RemoteSigned`
3. Make sure changes took effect by running
   `Get-ExecutionPolicy`

> For more info on execution policies, refer to this [link](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.3)

## Running pre-made script

1. Open the folder named `dist` in the root of the project
2. Right-click on the script named `run.ps1` and open it with powershell
3. You should have your browser opened on the url `localhost:8000`

## Troubleshooting

#### Powershell window openes and closes without effect

- Re-check the execution policy
- Try opening powershell in the `dist` directory and running the script manually by typing in powershell
  `.\run.ps1`

### Nothing happens when I run the script

Try running the web server manually by typing in powershell
`python -m http.server 8000`
and opening the url `localhost:8000` in your browser
