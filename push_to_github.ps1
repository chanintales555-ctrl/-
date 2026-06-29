# สคริปต์ช่วยอัปโหลดโปรเจกต์ขึ้น GitHub อัตโนมัติ
# วิธีใช้งาน: คลิกขวาที่ไฟล์นี้แล้วเลือก "Run with PowerShell" หรือเปิด PowerShell ในโฟลเดอร์นี้แล้วพิมพ์ .\push_to_github.ps1

Clear-Host
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "     เจฟช่วยอัปโหลดโปรเจกต์ขึ้น GitHub (Helper)     " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# ตรวจสอบว่าโปรเจกต์ทำการ Commit ไฟล์ในเครื่องเสร็จเรียบร้อยแล้ว
Write-Host "✅ [1/2] ค้นพบประวัติการ Commit ไฟล์ในเครื่องแล้ว" -ForegroundColor Green

# ถามลิงก์ GitHub จากผู้ใช้งาน
Write-Host ""
$repoUrl = Read-Host "กรุณาวางลิงก์ GitHub Repository ของคุณ`n(เช่น https://github.com/ชื่อคุณ/ชื่อคลัง.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host ""
    Write-Host "❌ ข้อผิดพลาด: ไม่พบลิงก์ GitHub กรุณารันสคริปต์นี้ใหม่อีกครั้ง" -ForegroundColor Red
    Write-Host "==================================================" -ForegroundColor Cyan
    Read-Host "กด Enter เพื่อปิด..."
    exit
}

# เชื่อมต่อกับ Remote Origin และดันโค้ดขึ้น GitHub
git remote remove origin 2>$null
git remote add origin $repoUrl
git branch -M main

Write-Host ""
Write-Host "🚀 [2/2] กำลังอัปโหลดโค้ดทั้งหมดขึ้น GitHub..." -ForegroundColor Green
Write-Host "--------------------------------------------------" -ForegroundColor DarkGray

# รันคำสั่ง push
git push -u origin main -f

if ($LASTEXITCODE -eq 0) {
    Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "🎉 เจฟอัปโหลดไฟล์ขึ้น GitHub เรียบร้อยแล้วครับ!" -ForegroundColor Green
    Write-Host "คุณสามารถปิดคอมพิวเตอร์เครื่องนี้ แล้วเปิดดูโค้ดหรือดึงไปแก้บนเครื่องอื่นได้เลย!" -ForegroundColor Yellow
} else {
    Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "❌ เกิดข้อผิดพลาดในการอัปโหลด" -ForegroundColor Red
    Write-Host "กรุณาตรวจสอบว่าคุณพิมพ์ลิงก์ถูกต้อง และมีการเชื่อมต่ออินเทอร์เน็ตอยู่หรือไม่" -ForegroundColor LightRed
}

Write-Host "==================================================" -ForegroundColor Cyan
Read-Host "กด Enter เพื่อปิด..."
